# The Inertial Measurement Unit (IMU) Sensor

## Measurement Model

An IMU outputs body-frame accelerometer $\bar{\boldsymbol{a}}^B$ and rate gyro $\bar{\boldsymbol{\omega}}^B$ measurements at 100-1000 Hz. The following measurement models assume that the IMU lies at the inertial center of the translating/rotating rigid body (which we'll call the *vehicle*). See the subsequent section on applying $SE(3)$ transforms for handling other cases.

### Accelerometer Model


An accelerometer, contrary to some belief, does *not* measure gravity. Instead, it measures the *specific force* (i.e., $\boldsymbol{F}/m$) that is currently preventing free fall. Thus, an accelerometer falling in a vacuum would measure $\boldsymbol{0}$, whereas an accelerometer sitting on a table would measure the specific normal force from the table, and an accelerometer onboard a hovering UAV would measure the specific thrust of the vehicle. The measurement equation is $$\bar{\boldsymbol{a}}^{B}=\left(\boldsymbol{R}_{B}^{W}\right)^{\top}\left(\boldsymbol{a}^{W}-\boldsymbol{g}^{W}\right)+\boldsymbol{\eta}_{a}^{B}+\boldsymbol{\beta}_{a}^{B},$$ where $\boldsymbol{a}^{W}$ is the inertial acceleration of the vehicle, $\boldsymbol{g}^{W}$ is the inertial gravity vector, and $\boldsymbol{\eta}_{a}^{B}$, $\boldsymbol{\beta}_{a}^{B}$ represent zero-mean Gaussian noise and non-zero bias. We can express acceleration as the (inertial) derivative of vehicle velocity, which gives

<WRAP round box>
**(A.1)**
$$\bar{\boldsymbol{a}}^{B}=\left(\boldsymbol{R}_{B}^{W}\right)^{\top}\left(\frac{d\boldsymbol{v}_{B/W}^{W}}{dt^{W}}-\boldsymbol{g}^{W}\right)+\boldsymbol{\eta}_{a}^{B}+\boldsymbol{\beta}_{a}^{B}.$$
</WRAP>

It's often the case, however, where we would like to express or are given velocity in the body frame. In that case, numerically differentiating velocity will yield $$\frac{d\boldsymbol{v}_{B/W}^{B}}{dt^{B}},$$ which is a derivative taken from the perspective of a rotating reference frame, and thus is not valid in a Newtonian-mechanics-sense on its own. Instead, we require the application of the transport theorem, $$\frac{d\cdot^{\circ}}{dt^{W}}=\frac{d\cdot^{\circ}}{dt^{\circ}}+\boldsymbol{\omega}_{\circ/W}^{\circ}\times\cdot^{\circ},$$ to yield the body-frame velocity version of the accelerometer measurement model: 

<WRAP round box>
**(A.2)**
$$\bar{\boldsymbol{a}}^{B}=\frac{d\boldsymbol{v}_{B/W}^{B}}{dt^{B}}+\boldsymbol{\omega}_{B/W}^{B}\times\boldsymbol{v}_{B/W}^{B}-\left(\boldsymbol{R}_{B}^{W}\right)^{\top}\boldsymbol{g}^{W}+\boldsymbol{\eta}_{a}^{B}+\boldsymbol{\beta}_{a}^{B}.$$
</WRAP>
### Rate Gyro Model

The rate gyro measurement model is much more straightforward, as it's just the true angular velocity (which is pretty much always expressed/given in the body frame) with added noise and bias: 

<WRAP round box>
**(B)**
$$\bar{\boldsymbol{\omega}}^{B}=\boldsymbol{\omega}_{B/W}^{B}+\boldsymbol{\eta}_{\omega}^{B}+\boldsymbol{\beta}_{\omega}^{B}.$$
</WRAP>
## Synthesizing Measurements

### Uncorrupted Measurements

Noise- and bias-less IMU measurements can be synthesized from simulation
truth data using the measurement equations **(A.1-2)**, **(B)**, themselves.
While most of the required state terms are straightforward to extract,
care must be taken to ensure that the correct velocity term is being
used for the chosen accelerometer model. Here are some likely cases:

  - A rigid body dynamics simulation is yielding a differential velocity term $\delta\boldsymbol{v}_{k}^{B}$ such that $\boldsymbol{v}_{k+1}^{B}=f(\boldsymbol{v}_{k}^{B},\delta\boldsymbol{v}_{k}^{B})$ where $f$ is some numerical integration technique (e.g., RK4). In this case, $\delta\boldsymbol{v}_{k}^{B}$ should be substituted in for the $d\boldsymbol{v}_{B/W}^{B}/dt^{B}$ term in Eq. **(A.2)**.
  - A rigid body dynamics simulation is yielding a differential velocity term $\delta\boldsymbol{v}_{k}^{W}$ such that $\boldsymbol{v}_{k+1}^{W}=f(\boldsymbol{v}_{k}^{W},\delta\boldsymbol{v}_{k}^{W})$. In this case, $\delta\boldsymbol{v}_{k}^{W}$ should be substituted in for the $d\boldsymbol{v}_{B/W}^{W}/dt^{W}$ term in Eq. **(A.1)**.
  - Access to the underlying dynamics simulation is not given, and instead one has a series of time-stamped body-frame velocity vectors $\boldsymbol{v}_{k}^{B}$. In this case, $\boldsymbol{v}_{k}^{B}$ must be numerically differentiated to obtain the $\delta\boldsymbol{v}_{k}^{B}$ terms from Case 1.
  - One has a series of time-stamped inertial velocity vectors $\boldsymbol{v}_{k}^{W}$. In this case, $\boldsymbol{v}_{k}^{W}$ must be numerically differentiated to obtain the $\delta\boldsymbol{v}_{k}^{W}$ terms from Case 2.

Similarly for angular velocity, if $\boldsymbol{\omega}_{k}^{B}$
isn't provided directly, then the orientation data, whether in matrix
or quaternion form, can be numerically differentiated on the manifold,
provided that the resulting tangent-space vectors are expressed as
local perturbations.
### Simulated Noise and Bias

The accelerometer and gyro each have their own noise and bias levels,
defined by a set of three numbers for each:

  * Noise standard deviation, $\sigma_{\eta}$
  * Initial bias range, $\kappa_{\beta_{0}}$
  * Bias walk standard deviation, $\sigma_{\beta}$

Noise and bias are then simulated at each time step according to the
recursive relationship:

<WRAP round box>
$$\boldsymbol{\beta}_{0}=\mathcal{U}(-\kappa_{\beta_{0}},\kappa_{\beta_{0}}),$$

$$\boldsymbol{\beta}_{k}=\boldsymbol{\beta}_{k-1}+\mathcal{N}(0,\sigma_{\beta})\Delta t,$$

$$\boldsymbol{\eta}_{\boldsymbol{k}}=\mathcal{N}(0,\sigma_{\eta}),$$
</WRAP>

where $\mathcal{U}$ and $\mathcal{N}$ are the uniform and normal
distributions.

## Shifting Measurements in $SE(3)$

Suppose we want an IMU measurement model for when the IMU is mounted
away from the inertially-centered body frame, still rigidly attached
to the vehicle. We have an $SE(3)$ transform description of the relationship
between the body frame and this "shifted" frame, which we'll refer
to as $U$: $$\boldsymbol{T}_{U}^{B}=\begin{bmatrix}\boldsymbol{R}_{U}^{B} & \boldsymbol{t}_{U/B}^{B}\\
\boldsymbol{0} & 1
\end{bmatrix}.$$

We will now derive the shifted accelerometer measurement $\bar{\boldsymbol{a}}^{U}$
in terms of the body-frame measurement $\bar{\boldsymbol{a}}^{B}$.
Applying Eq. **(A.1)**, the shifted measurement would be $$\bar{\boldsymbol{a}}^{U}=\left(\boldsymbol{R}_{U}^{W}\right)^{\top}\left(\frac{d\boldsymbol{v}_{U/W}^{W}}{dt^{W}}-\boldsymbol{g}^{W}\right)+\boldsymbol{\eta}^{U}+\boldsymbol{\beta}^{U}.
$$

Before proceeding, there are two key things to note from basic kinematics:

  - Because both $B$ and $U$ are rigidly attached to the same vehicle, $$\boldsymbol{\omega}_{U/W}=\boldsymbol{\omega}_{B/W}.$$
  - A frame with a non-zero offset away from the vehicle center of mass will experience additional velocity under vehicle rotation: $$\boldsymbol{v}_{U/W}=\boldsymbol{v}_{B/W}+\boldsymbol{\omega}_{B/W}\times\boldsymbol{t}_{U/B}.$$

Applying these two facts, the shifted measurement can be re-written
as 
\begin{align*}
\bar{\boldsymbol{a}}^{U} & =\left(\boldsymbol{R}_{U}^{B}\right)^{\top}\left(\bar{\boldsymbol{a}}^{B}+\frac{d}{dt^{W}}\left(\boldsymbol{\omega}_{B/W}^{B}\times\boldsymbol{t}_{U/B}^{B}\right)\right)\\
 & =\left(\boldsymbol{R}_{U}^{B}\right)^{\top}\left(\bar{\boldsymbol{a}}^{B}+\frac{d}{dt^{B}}\left(\boldsymbol{\omega}_{B/W}^{B}\times\boldsymbol{t}_{U/B}^{B}\right)+\boldsymbol{\omega}_{B/W}^{B}\times\left(\boldsymbol{\omega}_{B/W}^{B}\times\boldsymbol{t}_{U/B}^{B}\right)\right).\\
\end{align*}

Expanding the derivative and triple product terms, the concise shifted
accelerometer measurement equation is

<WRAP round box>

$$\bar{\boldsymbol{a}}^{U}=\left(\boldsymbol{R}_{U}^{B}\right)^{\top}\left(\bar{\boldsymbol{a}}^{B}+\left(\lfloor\dot{\boldsymbol{\omega}}\rfloor_{\times}+\boldsymbol{\omega}\boldsymbol{\omega}^{\top}-\boldsymbol{\omega}^{\top}\boldsymbol{\omega}\boldsymbol{I}\right)\boldsymbol{t}_{U/B}^{B}\right),$$

$$\boldsymbol{\omega}\triangleq\boldsymbol{\omega}_{B/W}^{B}.$$

</WRAP>

The shifted rate gyro equation involves only a frame change:

<WRAP round box>

$$\bar{\boldsymbol{\omega}}^{U}=\left(\boldsymbol{R}_{U}^{B}\right)^{\top}\bar{\boldsymbol{\omega}}^{B}.$$

</WRAP>
