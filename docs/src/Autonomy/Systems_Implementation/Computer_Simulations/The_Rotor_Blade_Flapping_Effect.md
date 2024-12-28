# The Rotor Blade Flapping Effect

## Source Papers

  - [[LIT] Quadrotor Helicopter Flight Dynamics and Control: Theory and Experiment](https://pdfs.semanticscholar.org/a3dd/e9f67353f7f000011351e757a0aaaf3ec941.pdf )
    - Considers **four aerodynamic effects** which arise when deviating significantly from hover flight regime
    - Taking them into account allows for improved tracking at higher speeds and in gusting winds
  - [[LIT] Propeller Thrust and Drag in Forward Flight](https://flyingmachinearena.org/wp-content/publications/2017/gilIEEE17.pdf)
  - [[LIT] Aerodynamics and Control of Autonomous Quadrotor Helicopters in Aggressive Maneuvering](http://ai.stanford.edu/~gabeh/papers/ICRA09_AeroEffects.pdf)
  - [[LIT] Improved State Estimation in Quadrotor MAVs: A Novel Drift-Free Velocity Estimator](https://arxiv.org/pdf/1509.03388.pdf)
    - focuses on the translational force that opposes quadrotor motion
    - actually uses it to get more accurate velocity estimation

## Consolidated Model

### Core Equations

A rotor in translational flight undergoes an effect known as blade flapping. The advancing blade of the rotor has a higher velocity relative to the free-stream, while the retreating blade sees a lower effective airspeed. This causes an imbalance in lift, inducing an up and down oscillation of the rotor blades. In steady state, this causes the effective rotor plane to tilt at some angle off of vertical, causing a deflection of the thrust vector (see Figure 2). If the rotor plane is not aligned with the vehicle’s center of gravity, this will create a moment about the center of gravity (\\(M_{b,lon}\\)) that can degrade attitude controller performance. For stiff rotors without hinges at the hub, there is also a moment generated directly at the rotor hub from the deflection of the blades (\\(M_{b,s}\\)).

The total moment on the UAV about the body pitch and roll axes comes from the contribution of each rotor \\(i\\):

$$M_{flap,\phi}=\sum_i (M_{b,lon,\phi,i}+ M_{b,s,\phi,i})$$

$$M_{b,lon,\phi,i}=T_ih\sin{a_{1s,\phi}}$$ 

$$M_{b,s,\phi,i}=k_\beta a_{1s,\phi}$$

$$a_{1s,\phi}=-k_f~^bv_y$$

$$M_{flap,\theta}=\sum_i (M_{b,lon,\theta,i}+ M_{b,s,\theta,i})$$

$$M_{b,lon,\theta,i}=T_ih\sin{a_{1s,\theta}}$$ 

$$M_{b,s,\theta,i}=k_\beta a_{1s,\theta}$$

$$a_{1s,\theta}=k_f~^bv_x$$

Where

\\(h\\) is the vertical distance from rotor plane to origin of the body frame ($m$),

\\(k_\beta\\) is the stiffness of the rotor blade (\\(N~m/rad\\)),

\\(k_f\\) is a constant providing a linear approximation to Eq. 8 on page 7 of [1]. The linear approximation is explained preceding Eq. 14 on page 4 of [3].

Additionally, the total force on the quadrotor is

$$^\mathcal{I}F_{flap}=-\lambda_1\sum_i\omega_i\tilde{V}$$

Where

\\(\omega_i\\) is the rotational speed of each rotor,

\\(\tilde{V}\\) is the projection of \\(^\mathcal{I}V\\) on to the propeller plane,

\\(\lambda_1\\) is a “critical parameter” which is the rotor drag coefficient, and probably entails an experimental estimation method (introduced on page 37 of [4])

Manipulating the relations from the top left of page 35 of [4], there is an easier-to-estimate parameter (again, see page 37) called \\(k_1\\) (which is assumed to be constant throughout stable flight) such that

$$ k_1=\lambda_1\sum_i\omega_i. $$

The authors of [4] found their \\(k_1\\) value to be equal to 0.57.

Motor thrust related to total angular rotation rate by the following relation (from page 33 of [4]):

$$T=k_T\sum_i\omega_i^2$$

where \\(k_T\\) is the "thrust coefficient" of the propellers.

### How to simulate effect

Currently, we are using a Force-Torque polynomial model fit to go directly from PWM motor commands to output thrusts and torques. This gives us no information about the individual rotor speed without an estimate of \\(k_T\\). **If all the rotor planes were parallel with each other**, this would not be a big deal if we had a reasonable estimate of \\(k_1\\). However, since our rotor planes are not guaranteed to be parallel, we need to use the following process to compute the blade flapping effect forces and torques on the UAV:

This is roughly what I'm doing in C++:

```cpp
double omega_Total = 0.0;
for (int i = 0; i < num_rotors_; i++)
{
    ...
    motor_speeds_(i, 0) = sqrt(abs(actual_forces_(i) / motor_kT_));
    omega_Total += motor_speeds_(i, 0);
}

* Blade flapping effect
for (int i = 0; i < num_rotors_; i++)
{
    * determine allocation of k_1 to each motor and calculate force and torques
    double k1i = motor_k1_ * motor_speeds_(i, 0) / omega_Total;

    * Calculate forces
    Force_ -= k1i * (Matrix3d::Identity() - motors_[i].normal*motors_[i].normal.transpose()) * airspeed_UAV;

    * Calculate torque about roll axis
    double as1phi = -motor_kf_ * airspeed_UAV(1);
    Torque_(0) -= actual_forces_(i) * motors_[i].position(2) * sin(as1phi);
    Torque_(0) += motor_kB_ * as1phi;

    // Calcualte torque about pitch axis
    double as1theta = motor_kf_ * airspeed_UAV(0);
    Torque_(1) -= actual_forces_(i) * motors_[i].position(2) * sin(as1theta);
    Torque_(1) += motor_kB_ * as1theta;
}
```

## Parameter Estimation Attempts

### Rotor Blade Stiffness \\(k_\beta\\)

Page 15 of [this thesis](http://www.diva-portal.org/smash/get/diva2:1070420/FULLTEXT01.pdf) gives a static bending test table for a nylon 6 rotor blade, Under a load of 0.9 N, the measured deflection at the tip of the blade (with a length of 6 in = 0.1524 m) was 0.0305 m. Numerous other load and deflection values were tabulated. The calculated elastic modulus from the table was 9.5 GPa.

Given the above numbers, \\(k_\beta\\) can be calculated as

$$k_\beta=\frac{(0.9N)(0.1524m)}{\tan^{-1}(0.0305m/0.1524m)}\approx 0.7 \frac{Nm}{rad}.$$

### Rotor Thrust Coefficient \\(k_T\\)

From [this paper](https://arxiv.org/pdf/1601.00733.pdf), it is noted that quadrotors tend to have very low thrust coefficients compared to helicopters (on the order of zero from looking at the figure on page 20). As a ballpark estimate, the paper explains that the quadrotors studied require motor speeds around 5000 RPM to keep the vehicle in the air. Assuming that a quadrotor's mass is somewhere around 2 kilograms and distributed evenly among four rotors, that would give a thrust coefficient of

$$k_T=\frac{F_{rotor}}{\omega^2}\approx 2.0 \times 10^{-5} \frac{N s^2}{rad^2}$$

which is in line with the figure.

### The Enigmatic \\(k_1\\) Parameter

I'm just copying the empirical value from [4] here, though it might be interesting in the future to replicate their parameter estimation process for our own platform if deemed necessary.

$$k_1 \approx 0.57 \frac{kg~rad}{s}$$
