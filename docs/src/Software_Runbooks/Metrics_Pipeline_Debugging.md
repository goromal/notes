# Metrics Pipeline Debugging Runbook

## Overview
This runbook provides step-by-step guidance for diagnosing and resolving issues in a metrics pipeline consisting of:
- A Python program emitting StatsD metrics
- Vector (StatsD source → Prometheus exporter sink)
- Prometheus (scraping metrics from Vector)
- Grafana (visualizing Prometheus data)

## Debugging Workflow

### **1. Verify Python Program is Emitting StatsD Metrics**
#### **Check if metrics are being sent**
Run the following command to manually send a StatsD metric:
```bash
echo "orchestrator_jobs_active:1|g" | nc -u -w1 127.0.0.1 9000
```

#### **Check Vector logs for received metrics**
```bash
journalctl -u vector -f | grep statsd
```
✅ If logs indicate received metrics → Vector is receiving data.

❌ If no logs appear → The Python program might not be sending metrics correctly or is targeting the wrong address/port.

---

### **2. Verify Vector is Exposing Metrics**
#### **Check if Vector’s Prometheus exporter is publishing metrics**
```bash
curl -s http://127.0.0.1:9598/metrics | grep orchestrator
```
✅ If metrics appear → Vector is working correctly.

❌ If no metrics appear →

- Ensure that Vector’s `flush_period_secs` is correctly configured.
- Check Vector logs for errors: `journalctl -u vector -f`.

---

### **3. Verify Prometheus is Scraping Metrics**
#### **Check Prometheus targets**
```bash
curl -s "http://localhost:9090/api/v1/targets" | jq '.data.activeTargets[] | {scrapeUrl, lastScrape, lastError, health}'
```
✅ If `health` is `"up"` and `lastError` is empty → Prometheus is successfully scraping.

❌ If `health` is `"down"` → There is a scraping issue (check `lastError`).

#### **Check if Prometheus has seen the metric**
```bash
curl -s "http://localhost:9090/api/v1/series?match[]=orchestrator_jobs_active" | jq .
```
✅ If the query returns data → Prometheus has recorded the metric.

❌ If empty → Check Vector and StatsD configuration.

#### **Query latest metric values**
```bash
curl -s "http://localhost:9090/api/v1/query?query=orchestrator_jobs_active" | jq .
```
✅ If a value is returned → The metric is stored.

❌ If no value is returned → Metrics may be expiring before they are scraped.

---

### **4. Fix Potential Issues**
#### **A. Vector’s `flush_period_secs` is Too Short**
If metrics disappear before Prometheus scrapes them, increase `flush_period_secs` in `vector.toml`:
```toml
[sinks.prometheus_exporter]
type = "prometheus_exporter"
inputs = ["statsd"]
address = "0.0.0.0:9598"
flush_period_secs = 30  # Set higher than Prometheus scrape interval
```
Restart Vector:
```bash
systemctl restart vector
```

#### **B. Prometheus Scrape Interval is Too Long**
Ensure Prometheus scrapes more frequently than Vector's flush interval (`prometheus.yml`):
```yaml
scrape_configs:
- job_name: "vector"
  scrape_interval: 5s  # Must be less than Vector’s flush_period_secs
  static_configs:
    - targets: ["0.0.0.0:9598"]
```
Restart Prometheus:
```bash
systemctl restart prometheus
```

#### **C. Metrics Are Not Updating**
Manually send a StatsD metric:
```bash
echo "orchestrator_jobs_active:5|g" | nc -u -w1 127.0.0.1 9000
```
Immediately query Prometheus:
```bash
curl -s "http://localhost:9090/api/v1/query?query=orchestrator_jobs_active" | jq .
```
If the metric appears but disappears later, Vector may be expiring stale metrics too soon.

#### **D. Verify Prometheus Retention Settings**
Check retention settings:
```bash
prometheus --storage.tsdb.retention.time
```
If retention is low (e.g., `1h`), increase it:
```bash
prometheus --storage.tsdb.retention.time=7d
```

---

## **Final Debugging Checklist**

- ✅ **Python program emits StatsD metrics** (`nc -u -w1 127.0.0.1 9000`)
- ✅ **Vector receives metrics** (`journalctl -u vector -f | grep statsd`)
- ✅ **Vector exposes metrics correctly** (`curl -s http://127.0.0.1:9598/metrics`)
- ✅ **Prometheus scrapes successfully** (`api/v1/targets` with `health: "up"`)
- ✅ **Metrics are stored in Prometheus** (`api/v1/query?query=orchestrator_jobs_active`)

Following this runbook will help identify and resolve issues efficiently when debugging the metrics pipeline.

