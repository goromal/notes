# Avahi Runbook

When debugging mDNS issues with Avahi on a LAN, particularly when a `.local` hostname like `ats.local` suddenly disappears despite the host being up, here’s a systematic approach to debug it:

---

### ✅ **1. Check if the host is still advertising via Avahi**

On another machine on the LAN, run:

```bash
avahi-browse -a -t
```

Look for the `ats.local` hostname in the output.

You can also be more specific:

```bash
avahi-resolve-host-name ats.local
```

If this fails, then it confirms that the mDNS record is no longer available or has expired.

---

### ✅ **2. Check Avahi status on the target host (e.g., `ats`)**

On the `ats` host, run:

```bash
sudo systemctl status avahi-daemon
```

If it's not active, start or restart it:

```bash
sudo systemctl restart avahi-daemon
```

Also check for errors in logs:

```bash
journalctl -u avahi-daemon
```

Look for signs of:

* Interface failures
* Conflicts (e.g., another device trying to register `ats.local`)
* Crashes or socket errors

---

### ✅ **3. Check hostname and Avahi publishing config on `ats`**

Ensure that `ats` is still using the expected hostname:

```bash
hostname
```

Check if Avahi is advertising it correctly:

```bash
avahi-publish -a -v ats.local <IP_ADDRESS>
```

If `ats.local` has been "taken" by another host due to a race condition or network issue, Avahi might auto-rename it (e.g., to `ats-2.local`). Look for such names with:

```bash
avahi-browse -a
```

---

### ✅ **4. Confirm networking and firewall settings**

Make sure:

* UDP port 5353 is open (used by mDNS)
* Your firewall isn’t blocking multicast traffic
* You’re on the same subnet

You can test multicast reachability with:

```bash
ping -b 224.0.0.251
```

Or use `tcpdump` to confirm mDNS traffic:

```bash
sudo tcpdump -i <interface> port 5353
```

Watch for queries and responses involving `ats.local`.

---

### ✅ **5. Restart Avahi and re-announce services**

If things still look stale or broken, try a full Avahi restart on the `ats` host:

```bash
sudo systemctl restart avahi-daemon
```

Then re-check service announcements with `avahi-browse`.

---

### ✅ **6. Tools for further debugging**

* `avahi-discover`: GUI tool to browse mDNS services.
* `dns-sd` (on macOS): e.g., `dns-sd -B _services._dns-sd._udp`
* `nss-mdns`: make sure the system resolves `.local` via Avahi (not some other resolver or caching DNS system).

In `/etc/nsswitch.conf` you should see:

```
hosts: files mdns4_minimal [NOTFOUND=return] dns
```
