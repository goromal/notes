# The Kinematic Filters

*No need for a sophisticated dynamic model (if you can get away with it).*

The filters presented here are for LTI systems that can be well-approximated as *kinematic*:

$$\boldsymbol{x}=\begin{bmatrix}x & \dot{x} & \ddot{x} & \cdots\end{bmatrix}^T,$$

$$\dot{\boldsymbol{x}}=\begin{bmatrix}0 & 1 & 0 & \cdots & 0\\\0 & 0 & 1 & \cdots & 0\\\ \vdots & \vdots & \vdots & \vdots & \vdots\\\ 0 & 0 & 0 & \cdots & 1\\\0 & 0 & 0 & \cdots & 0\end{bmatrix}\boldsymbol{x}+\begin{bmatrix}0\\\0\\\ \vdots\\\0\\\1\end{bmatrix}\boldsymbol{u},$$

$$\boldsymbol{y}=\begin{bmatrix}1 & 0 & 0 & \cdots\end{bmatrix}\boldsymbol{x}=x.$$

For these formulations, we'll go one step further and set \\(\boldsymbol{B}=0\\). The presented filters increase in order from constant position to constant velocity to constant acceleration models. Anything beyond that probably won't be worth it as higher-order terms empirically tend to become more significant as the system order increases. The derived filters will be of the form

\\[ \hat{\boldsymbol{x}}\_{k+1}=e^{\boldsymbol{A}\Delta t}\hat{\boldsymbol{x}}\_{k}+\boldsymbol{l}r \\]

\\[r\triangleq x-\hat{x}. \\]

Both ad hoc and covariance-based analytic methods are presented for determining the coefficients of \\(\boldsymbol{l}\\). To provide some intuition for these methods:

<WRAP group> <WRAP half column> <WRAP centeralign> **Ad Hoc Coefficients** </WRAP> 

Coefficients are determined based on a kind of *discount factor*, \\(\theta\\). 

Since the filter minimizes least-squares error of the residuals through time, \\(\theta<1\\) weights how much influence the residuals have on the final estimate. Thus, a smaller \\(\theta\\) will prioritize the filter's state memory value over individual residuals. This is an intuition that generalizes to the higher-order kinematic filters as well as the one-dimensional case. 

</WRAP> <WRAP half column> <WRAP centeralign> **Covariance-Based Coefficients** </WRAP> 

With this method of assigning coefficients, the kinematic filter turns into a Luenberger observer / steady-state Kalman Filter with a kinematic model. Thus, it could possibly be optimal! The covariances used for calculating the coefficients are

$\sigma_w=$ process noise: $\dot{\boldsymbol{x}}=\boldsymbol{A}\boldsymbol{x}+\boldsymbol{w}(t)$

$\sigma_v=$ measurement noise: $\boldsymbol{y}=\boldsymbol{C}\boldsymbol{x}+\boldsymbol{v}(t)$

You will see that, in comparing with the ad hoc method, $\theta\sim \sigma_w/\sigma_v$, which is appropriate. If $\sigma_w\gg \sigma_v$, then residuals should dominate the estimate, hence a large $\theta$.

</WRAP> </WRAP>

If you're able to approximate your system as kinematic$^*$, then one of these filters may end up working$^{**}$ for your application$^{***}$.


----


$^*$ Think Taylor Series expansion...either $\Delta t$ between corrective observations should be really small, the neglected higher-order derivatives should be small, and/or their combination should be small!

$^{**}$ If you're able to obtain sufficiently high-rate corrective measurements, for instance, then the point of the filter is (1) predictive ability and (2) full-state tracking. *You may say that* those two things can be accomplished with numerical differentiation and using those derivatives to propagate kinematic models yourself. You would be right! The filters here do exactly that; in addition to propagating simple kinematic models, they can be viewed as essentially *fancy numerical differentiators that handle noisy data in a principled fashion*. They also have the advantage of automatically encoding past information for higher-order derivatives in their state vector, a la the Markov assumption for LTI observers, which keeps track of every derivative up to the desired order (mentioned in passing on [this page](http://www.holoborodko.com/pavel/numerical-methods/numerical-derivative/smooth-low-noise-differentiators/)).

$^{***}$ One notable example is in motion capture systems, where high-rate, reliable pose measurements are fused into real-time position, velocity, and acceleration estimates. It wouldn't be a good idea to use these for tracking attitude, though, which is obviously nonlinear. These filters are also used in many tracking scenarios, such as Raytheon's radar-based missile trackers (see *TRACKING AND KALMAN FILTERING MADE EASY* by Eli Brookner).

## Constant Position ($\alpha$- or $g$- Filter)

### Filter Overview

^ **Quantity** ^ **Value** ^
| $\hat{\boldsymbol{x}}$ | $\begin{bmatrix}\hat{x}\end{bmatrix}$ |
| $\boldsymbol{A}$ | $0$ |
| $e^{\boldsymbol{A}\Delta t}$ | $\boldsymbol{I}+\cdots=1$ |
| Prediction Step | $\hat{\boldsymbol{x}}^-_{k+1}=\hat{\boldsymbol{x}}^+_k$ |
| Update Step | $\hat{\boldsymbol{x}}^+_k=\hat{\boldsymbol{x}}^-_k+\alpha r$ |

**Ad Hoc Coefficients**

$\alpha=\theta$.

**Analytical Coefficients**

$\lambda=\frac{\sigma_w\Delta t^2}{\sigma_v},$

$\alpha=\frac{-\lambda^2+\sqrt{\lambda^4+16\lambda^2}}{8}.$
### Connection to Low-Pass Filtering

Recall that the continuous form of the $\alpha$-filter:

$$\dot{\hat{x}}=\alpha r=\alpha(x-\hat{x})$$

is a first-order ODE. If you think of the measurement at each time step as a system input $u$, and the filter estimate as the system internal state, then this describes both a first-order system and a low-pass filter! Thus, you get [the namesake alpha low-pass filter and first-order system simulator](autonomy:estimation:estimator-algs#alpha_filter), to which the math and intuition above directly applies.


## Constant Velocity ($\alpha$-$\beta$- or $g$-$h$- Filter)

### Filter Overview

^ **Quantity** ^ **Value** ^
| $\hat{\boldsymbol{x}}$ | $\begin{bmatrix}\hat{x} & \hat{v}\end{bmatrix}^T$ |
| $\boldsymbol{A}$ | $\begin{bmatrix}0 & 1\\0 & 0\end{bmatrix}$ |
| $e^{\boldsymbol{A}\Delta t}$ | $\boldsymbol{I}+\boldsymbol{A}\Delta t + \cdots=\begin{bmatrix}1 & \Delta t\\0 & 1\end{bmatrix}$ |
| Prediction Step | $\hat{\boldsymbol{x}}^-_{k+1}=\begin{bmatrix}1 & \Delta t\\0 & 1\end{bmatrix}\hat{\boldsymbol{x}}^+_k$ |
| Update Step | $\hat{\boldsymbol{x}}^+_k=\hat{\boldsymbol{x}}^-_k+\begin{bmatrix}\alpha \\ \beta/\Delta t\end{bmatrix} r$ |

**Ad Hoc Coefficients**

$\alpha = 1-\theta^2,$

$\beta=(1-\theta)^2.$

**Analytical Coefficients**

$\lambda=\frac{\sigma_w\Delta t^2}{\sigma_v},$

$r=\frac{4+\lambda-\sqrt{8\lambda+\lambda^2}}{4},$

$\alpha=1-r^2,$

$\beta=2(2-\alpha)-4\sqrt{1-\alpha}.$
### Connection to the Dirty Derivative

Writing out the full form of the $\alpha$-$\beta$ filter:

$$\begin{bmatrix}\hat{x}_{k}^{+}\\
\dot{\hat{x}}_{k}^{+}
\end{bmatrix}=\begin{bmatrix}1 & \Delta t\\
0 & 1
\end{bmatrix}\begin{bmatrix}\hat{x}_{k-1}^{+}\\
\dot{\hat{x}}_{k-1}^{+}
\end{bmatrix}+\begin{bmatrix}\alpha\\
\beta/\Delta t
\end{bmatrix}(x_{k}-\hat{x}_{k}^{-})$$

The derivative term is calculated in terms of the rest of the state as

$$\begin{align*}
\dot{\hat{x}}_{k}^{+} & =\dot{\hat{x}}_{k-1}^{+}+\beta/\Delta t(x_{k}-\hat{x}_{k}^{-})\\
 & =\dot{\hat{x}}_{k-1}^{+}+\beta/\Delta t(x_{k}-\hat{x}_{k-1}^{+}-\dot{\hat{x}}_{k-1}^{+}\Delta t)\\
 & =(1-\beta)\dot{\hat{x}}_{k-1}^{+}+\beta/\Delta t(x_{k}-\hat{x}_{k-1}^{+}).
\end{align*}$$

Getting rid of the estimator notation and substituting $\beta\leftarrow \frac{2\Delta t}{2\sigma + \Delta t}$, we obtain:

$$\dot{x}_{k}=\left(\frac{2\sigma-\Delta t}{2\sigma+\Delta t}\right)\dot{x}_{k-1}+\left(\frac{2}{2\sigma+\Delta t}\right)(x_{k}-x_{k-1}),$$

which is the equation for the dirty derivative! So, the dirty derivative is a special case of the $\alpha$-$\beta$-filter, where $\alpha=0$ and $\beta=\frac{2\Delta t}{2\sigma + \Delta t}$. This is reminiscent of how a low-pass filter implementation of the $\alpha$ filter uses the rise time of its transfer function to set its coefficient value.

## Constant Acceleration ($\alpha$-$\beta$-$\gamma$- or $g$-$h$-$k$- Filter)

### Filter Overview

^ **Quantity** ^ **Value** ^
| $\hat{\boldsymbol{x}}$ | $\begin{bmatrix}\hat{x} & \hat{v} & \hat{a}\end{bmatrix}^T$ |
| $\boldsymbol{A}$ | $\begin{bmatrix}0 & 1 & 0\\0 & 0 & 1\\0 & 0 & 0\end{bmatrix}$ |
| $e^{\boldsymbol{A}\Delta t}$ | $\boldsymbol{I}+\boldsymbol{A}\Delta t + \frac{1}{2}\left(\boldsymbol{A}\Delta t\right)^2 + \cdots=\begin{bmatrix}1 & \Delta t & \Delta t^2/2\\0 & 1 & \Delta t\\0 & 0 & 1\end{bmatrix}$ |
| Prediction Step | $\hat{\boldsymbol{x}}^-_{k+1}=\begin{bmatrix}1 & \Delta t & \Delta t^2/2\\0 & 1 & \Delta t\\0 & 0 & 1\end{bmatrix}\hat{\boldsymbol{x}}^+_k$ |
| Update Step | $\hat{\boldsymbol{x}}^+_k=\hat{\boldsymbol{x}}^-_k+\begin{bmatrix}\alpha \\ \beta/\Delta t \\ 2\gamma/\Delta t^2\end{bmatrix} r$ |

**Ad Hoc Coefficients**

$\alpha=1-\theta^3$,

$\beta = \frac{3}{2}(1-\theta^2)(1-\theta)$,

$\gamma = \frac{1}{2}(1-\theta)^3$.

**Analytical Coefficients**

$\lambda=\frac{\sigma_{w}\Delta t^{2}}{\sigma_{v}},$

$b=\frac{\lambda}{2}-3$,

$c=\frac{\lambda}{2}+3,$

$d=-1,$

$p=c-\frac{b^{2}}{3},$

$q=\frac{2b^{3}}{27}-\frac{bc}{3}+d,$

$v=\sqrt{q^{2}+\frac{4p^{3}}{27}},$

$z=-\left(q+\frac{v}{2}\right)^{1/3},$

$s=z-\frac{p}{3z}-\frac{b}{3},$

$\alpha=1-s^{2},$

$\beta=2(1-s)^{2},$

$\gamma=\frac{\beta^{2}}{2\alpha}.$

