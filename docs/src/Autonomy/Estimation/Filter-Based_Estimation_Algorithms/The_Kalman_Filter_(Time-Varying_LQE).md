# The Kalman Filter (Time-Varying LQE)

The Kalman Filter deals with estimating $\hat{\boldsymbol{x}}$ for linear *dynamic* systems, which adds real-time optimality properties to the basic [Luenberger Observer LQE](public:autonomy:estimation:estimator-algs:luen-obs).

You'll probably only ever implement the discrete-time version of the Kalman filter. A nice tutorial can be found [here](https://www.kalmanfilter.net/default.aspx).

## Discrete-Time Kalman Filter

### Overview

**Problem Statement:** Obtain the unbiased, minimum-variance linear estimate for all $\boldsymbol{x}_k$ given the sequence of measurements $\boldsymbol{y}_k$, subject to the dynamic and measurement models

$$\boldsymbol{x}_{k+1}=\boldsymbol{A}_k\boldsymbol{x}_k+\boldsymbol{B}_k\boldsymbol{u}_k+\boldsymbol{w}_k$$

$$\boldsymbol{y}_k=\boldsymbol{C}_k\boldsymbol{x}_k+\boldsymbol{v}_k$$

$$E[\boldsymbol{w}_k]=0,~E[\boldsymbol{v}_k]=0,~E[\boldsymbol{w}_j\boldsymbol{w}_k^T]=\boldsymbol{W}_k\delta_{jk},~E[\boldsymbol{v}_j\boldsymbol{v}_k^T]=\boldsymbol{V}_k\delta_{jk},~E[\boldsymbol{w}_k\boldsymbol{v}_j^T]=0$$

$$E[\boldsymbol{x}_0]=\bar{\boldsymbol{x}}_0,~E[(\boldsymbol{x}_0-\bar{\boldsymbol{x}}_0)(\boldsymbol{x}_0-\bar{\boldsymbol{x}}_0)^T]=\boldsymbol{P}_0$$

with $\boldsymbol{w}_k$ and $\boldsymbol{v}_k$ independent of $\boldsymbol{x}_0$. There are many, many ways to derive the solution; *16.32L16* derives it using the optimal projection theorem (see the end of the previous section). The solution is the discrete-time Kalman Filter (which is the version you would implement on a computer, most likely).

This is the optimal linear filter, even if we added a positive definite matrix weighting term $\boldsymbol{S}_k$ to the cost. It would be relatively straightforward to extend the algorithm to accommodate things like colored noise sequences and correlated measurement/process noise.

It should be noted that the residual sequence $\boldsymbol{r}_k=\boldsymbol{y}_k-\boldsymbol{C}_k\hat{\boldsymbol{x}}_k$ is white, such that $E[\boldsymbol{r}_k]=0$ and $E[\boldsymbol{r}_k\boldsymbol{r}_j^T]=0,~j\neq k$. This is useful for verifying the optimality of an implemented filter.

### Algorithm

  - *Initialization:* $\hat{\boldsymbol{x}}_0=\bar{\boldsymbol{x}}_0$, $\boldsymbol{Q}_0=\boldsymbol{P}_0$
  - *State Propagation:* $\hat{\boldsymbol{x}}_{k+1}^-=\boldsymbol{A}_{k}\hat{\boldsymbol{x}}_{k}^++\boldsymbol{B}_k\boldsymbol{u}_k$
  - *Covariance Propagation:* $\boldsymbol{Q}_{k+1}^-=\boldsymbol{A}_{k}\boldsymbol{Q}_{k}^+\boldsymbol{A}_{k}^T+\boldsymbol{W}_{k}$
  - *Kalman Gain Calculation:* $\boldsymbol{L}_k=\boldsymbol{Q}_k^-\boldsymbol{C}_k^T(\boldsymbol{C}_k\boldsymbol{Q}_k^-\boldsymbol{C}_k^T+\boldsymbol{V}_k)^{-1}$
  - *Measurement Update:* $\hat{\boldsymbol{x}}_{k}^+=\hat{\boldsymbol{x}}_{k}^-+\boldsymbol{L}_k(\boldsymbol{y}_k-\boldsymbol{C}_k\hat{\boldsymbol{x}}_k^-)$
  - *Covariance Update:* $\boldsymbol{Q}_{k}^+=(\boldsymbol{I}-\boldsymbol{L}_k\boldsymbol{C}_k)\boldsymbol{Q}_k^-(\boldsymbol{I}-\boldsymbol{L}_k\boldsymbol{C}_k)^T+\boldsymbol{L}_k\boldsymbol{V}_k\boldsymbol{L}_k^T$

The covariance update step above (which adds a positive definite matrix to a positive semidefinite one) is the preferable equation to use over the sometimes-cited $\boldsymbol{Q}_{k}^+=(\boldsymbol{I}-\boldsymbol{L}_k\boldsymbol{C}_k)\boldsymbol{Q}_k^-$, which is more prone to become indefinite due to numerical rounding errors as a positive semi-definite matrix is *subtracted* from a positive definite one.

## Continuous-Time Kalman Filter

### Overview

**Problem Statement:** Obtain the minimum-variance linear estimate of $\boldsymbol{x}(t)$ given a continuous measurement function $\boldsymbol{y}(t)$, subject to the dynamic and measurement models

$$\dot{\boldsymbol{x}}(t)=\boldsymbol{A}(t)\boldsymbol{x}(t)+\boldsymbol{B}_w(t)\boldsymbol{w}(t)$$

$$\boldsymbol{y}(t)=\boldsymbol{C}(t)\boldsymbol{x}(t)+\boldsymbol{v}(t)$$

$$E[\boldsymbol{w}(t)]=0,~E[\boldsymbol{v}(t)]=0,~E[\boldsymbol{w}(t)\boldsymbol{w}(\tau)^T]=\boldsymbol{W}(t)\delta(t-\tau),~E[\boldsymbol{v}(t)\boldsymbol{v}(\tau)^T]=\boldsymbol{V}(t)\delta(t-\tau),~E[\boldsymbol{w}(t)\boldsymbol{v}(\tau)^T]=0$$

$$E[\boldsymbol{x}(t_0)]=\bar{\boldsymbol{x}}_0,~E[(\boldsymbol{x}(t_0)-\bar{\boldsymbol{x}}_0)(\boldsymbol{x}(t_0)-\bar{\boldsymbol{x}}_0)^T]=\boldsymbol{Q}_0$$

with $\boldsymbol{w}(t)$ and $\boldsymbol{v}(t)$ independent of $\boldsymbol{x}(t_0)$. Again, there are many ways to derive the solution, and *16.32L17* gives derivations from the optimal projection theorem, taking the limit of the discrete-time KF, solving an optimal control problem with *ad hoc* cost, and solving an optimal control problem to optimize the choice of filter gain $\boldsymbol{L}$.

Note that if you were trying to *sample* from $\boldsymbol{y}(t)$ (defined to be a white-noise process), you'd be tempted to model that as $\boldsymbol{y}_k=\boldsymbol{y}(k\Delta t)$. BUT, because white noise varies over time with no rhyme or reason, the resulting covariance would actually be infinite! Instead, you have to time-average the white noise to get a pseudo-discrete-time measurement $\boldsymbol{y}_k=1/\Delta t\int_{k\Delta t}^{(k+1)\Delta t}\boldsymbol{y}(t)dt$, which has a mean of $\approx \boldsymbol{C} \boldsymbol{x}_k$ and a covariance of $\approx 1/\Delta t \boldsymbol{V}$.

Another important note: the differential equation for covariance is calculated to be the *continuous-time differential Riccati equation for the Kalman Filter*:

$$\dot{\boldsymbol{Q}}(t)=\boldsymbol{A}(t)\boldsymbol{Q}(t)+\boldsymbol{Q}(t)\boldsymbol{A}(t)^T+\boldsymbol{B}_w(t)\boldsymbol{W}(t)\boldsymbol{B}_w(t)^T-\boldsymbol{Q}(t)\boldsymbol{C}(t)^T\boldsymbol{V}(t)^{-1}\boldsymbol{C}(t)\boldsymbol{Q}(t)$$

which is the dual of the LQR CARE for the costate! The conditions for this Kalman Filter are also the dual of the LQR conditions:

  * Must be observable (detectable?) through $\boldsymbol{C}$
  * Must be controllable (stabilizable?) through $\boldsymbol{B}_w$

Remember how, even with a time-varying linear system, the steady-state result of the CARE gives a nearly optimal LQR with a long time horizon? The same logic applies here. However, since the KF ARE integrates forward in time, why not just solve it normally to get the fully optimal solution?

As with the discrete-time case, the residual $\boldsymbol{r}(t)=\boldsymbol{y}(t)-\boldsymbol{C}(t)\hat{\boldsymbol{x}}(t)$ is also a white noise process, demonstrating optimality.

FYI, the transfer-function version of the continuous-time KF is called the *Wiener filter*.

### Algorithm

  - $\dot{\hat{\boldsymbol{x}}}(t)=\boldsymbol{A}(t)\hat{\boldsymbol{x}}(t)+\boldsymbol{L}(t)(\boldsymbol{y}(t)-\boldsymbol{C}(t)\hat{\boldsymbol{x}}(t))$
  - $\dot{\boldsymbol{Q}}=(\boldsymbol{A}-\boldsymbol{L}\boldsymbol{C})\boldsymbol{Q}+\boldsymbol{Q}(\boldsymbol{A}-\boldsymbol{L}\boldsymbol{C})^T+\boldsymbol{L}\boldsymbol{V}\boldsymbol{L}^T+\boldsymbol{B}_w\boldsymbol{W}\boldsymbol{B}_w^T$
  - $\boldsymbol{L}(t)=\boldsymbol{Q}(t)\boldsymbol{C}(t)^T\boldsymbol{V}(t)^{-1}$

