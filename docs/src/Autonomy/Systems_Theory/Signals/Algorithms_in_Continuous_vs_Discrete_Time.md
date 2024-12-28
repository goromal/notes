# Algorithms in Continuous vs Discrete Time

In most of what you've seen so far, the question of discretization comes up always when you're implementing either a simulation or a control scheme on a computer, which inherently deals in time-discretized operations. Really, the issue/need for distinction between discrete and continuous modeling arises wherever **derivatives** and **integrals** show up--how to deal with them when we can only perform discrete operations? There are various options, and you can choose what works best for you.

When it comes to dealing with **integrals** (as is the case with simulation) you can:

----

Discretize our *model*. For LTI systems, we obtain difference equations of the form
  
$$x_{k+1}=A_dx_k+B_du_k.$$

To get the values of \\(A_d\\) and \\(B_d\\), consider the analytical solution of the continuous-time version of the \\(\dot{x}=Ax+Bu\\) LTI system:

$$x(t)=e^{At}x_0+\int_0^te^{A(t-\tau)}Bu(\tau)d\tau.$$
  
and imagine that we discretize the system by integrating over short time steps \\(\Delta t\\) and continuously resetting \\(x_0\\). If \\(\Delta t\\) is small enough, then we can get away with linearizing the solution to the linear ODE, if you will:

$$x(\Delta t)\approx e^{A\Delta t}x_0+\left(\int_0^{\Delta t}e^{A\tau}d\tau\right)Bu$$

$$\triangleq A_d x_0 + B_d u,$$
  
so \\(A_d = e^{A\Delta t} \approx I + A \Delta t\\) and \\(B_d = \left(\int_0^{\Delta t}e^{A\tau}d\tau\right)B \approx A^{-1}(A_d-I)B\\) (if \\(A\\) is nonsingular).

----

OR

----

Keep our continuous (perhaps nonlinear) model

$$\dot{x}=f(x,u)$$

and instead discretize the *integration scheme itself*, \\(\int_0^{\Delta t}f dt\approx \mathcal{I}\\):

$$x_{k+1}=x_k+\mathcal{I}$$

Here are :

  * **Euler integration**: 

$$\mathcal{I}=f(x_k,u_k) \Delta t.$$

  * **Trapezoidal integration**:

$$\mathcal{I}=(k_1+k_2) \Delta t/2,$$

$$k_1=f(x_{k-1},u_{k-1}),$$

$$k_2=f(x_k,u_k).$$

  * **4th-order Runge-Kutta integration**: 

$$\mathcal{I}=(k_1+2k_2+2k_3+k_4) \Delta t/6,$$

$$k_1=f(x_k,u_k),$$

$$k_2=f(x_k+k_1\Delta t/2,u_k),$$

$$k_3=f(x_k+k_2\Delta t/2,u_k),$$

$$k_4=f(x_k+k_3\Delta t, u_k).$$

[Explicit Runge-Kutta methods](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#Explicit_Runge%E2%80%93Kutta_methods) generalize the above formulas.

----

When it comes to dealing with **derivatives** (as is the case with controlling off of state derivatives) you can:

----

Use the discrete model \\(x_{k+1}=A_dx_k+B_du_k\\) to derive a *discrete controller*. This is the only choice, unfortunately, when your control method has to have the dynamics engrained in when calculating the control, *and* that calculation must be done online with no room for inter-step approximate derivatives and integrals. Some examples of when this happens:

  * Some trajectory optimization techniques where you express the discrete dynamics as constraints (some programs like GPOPS-II allow you to specify the continuous derivatives, and they discretize things for you)
  * Dynamic programming, as with deriving time-varying, discrete LQR


----

OR

----

Use the continuous model \\(\dot{x}=Ax+Bu\\) to derive the *continuous controller offline with calculus* (as with standard LQR, PID), then apply discrete //derivative/integral// operators derived with the Tustin approximation, etc. to provide inputs to the continuous controller during operation.

Discrete integration is often performed with the trapezoidal approximation, which is shown above.

Some different implementations of the discrete derivative operator:

  * **Tustin approximation of “dirty derivative”**:

Tustin approximation is

$$s \rightarrow \frac{2}{\Delta t}\left(\frac{1-z^{-1}}{1+z^{-1}}\right),$$

and the dirty derivative (derivative + low-pass filter, since the pure differentiator is not causal) is

$$\dot{X}(s)=\frac{s}{\sigma s+1}X(s),$$

and applying the approximation yields

$$\dot{x}_k=\left(\frac{2\sigma-\Delta t}{2\sigma + \Delta t}\right)\dot{x}\_{k-1}+\left(\frac{2}{2\sigma+\Delta t}\right)(x_k-x\_{k-1}).$$

  * **Finite differencing**
  * **Complex derivative**

----

The **question** I find myself asking, then, is whether or not I can get away with only discretizing the derivative and integral operations, if there are any, so that I can just deal with the continuous model and calculus-based controller derivation!

