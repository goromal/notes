# Nonlinear Optimization

*When the cost function or constraints are not linear.*

## Unconstrained Form

### Background

Our optimization tools tend to be **convex** solvers, in which case they're only good at finding local minima.

With continuous derivatives (i.e., smooth functions), we use Taylor series expansions (with gradient \\(g(x)\\) and Hessian \\(H(x)\\)) for function approximation:

$$ F(x+\delta x)\approx F(x)+\Delta x^Tg(x)+\frac{1}{2}\Delta x^TH(x)\Delta x + \cdots $$

  * Necessary and Sufficient Conditions:
    * Necessary (for stationary point): \\(g(x^*)=0\\)
    * Sufficient (for strong minimum): \\(H(x^*)>0\\)
    * Sufficient (for weak minimum): \\(H(x^*)\geq0\\) (or Necessary for strong minimum)
  * Checking for positive definiteness:
    * Eigenvalue criteria
    * Gaussian elimination (\\(O(n^3)\\)): every pivot positive after elimination
    * Sylvester criterion (\\(O(n!)\\))

### Methods

#### Newton's Method

Using a second-order Taylor expansion, with \\(\Delta x=x-x_k\\), and getting an approximate value for \\(\nabla F(x)\approx g_k+H_k(x-x_k)\\), we solve for the point where \\(\nabla F(x)=0\\) and move there:

$$x_{k+1}=x_k-H_k^{-1}g_k$$

Obviously, if \\(F\\) is only a quadratic function, then this will solve for **a stationary point** in **one step**, and can converge **super-linearly** (error reduced by increasing factors) for non-quadratic \\(F\\). Sometimes isn't ideal in the neighborhood of the minimum, and requires the costly computation of the Hessian.

Regardless of the weaknesses, the *best* descent direction is always \\(d=-H^{-1}\nabla\\).

[Some external notes](http://www2.lawrence.edu/fast/GREGGJ/Math420/Sections_2_3_to_2_5.pdf) on Newton’s Method.

#### Steepest Descent (Gradient-Only)

Hessian ignored (i.e., set to \\(I\\)):

$$d=-\nabla$$

A line search method is used to see just how far to go in the descent direction. Doesn't do well with \\(F\\) with poorly-conditioned Hessians. Convergence rate can be as bad as

$$\mu\approx 1-\frac{2}{\text{cond}(H)}$$

#### Quasi-Newton Methods (Approximate the Hessian)

Uses Newton Method update, but approximates either the Hessian or its inverse at each time step. If \\(F\\) is quadratic, then Hessian is exact after \\(\text{dim}(x)\\) steps! **BFGS** the most popular method nowadays. Estimating inverse Hessian \\(B_k=H_k^{-1}\\) directly:

$$B_0=I$$
$$d_k=-B_kg_k$$
$$x_{k+1}=x_k+\alpha_kd_k$$
$$s_k=\alpha_kd_k$$
$$y_k=g_{k+1}-g_k$$
$$B_{k+1}=B_k-\frac{(B_ky_k)s_k^T+s_k(B_ky_k)^T}{y_k^Ts_k}+\frac{y_k^Ts_k+y_k^T(B_ky_k)}{(y_k^Ts_k)^2}s_ks_k^T$$

Line search also used to find step size \\(\alpha_k\\), but doesn't even have to be all that good. Just has to satisfy **Wolfe** conditions (Armijo rule + curvature condition) for BFGS to maintain a \\(B_k>0\\):

$$f(x_k+\alpha_kd_k)\leq f(x_k)+c_1\alpha_kd_k^T\nabla f(x_k)$$
$$-d_k^T\nabla f(x_k+\alpha_kd_k)\leq -c_2d_k^T\nabla f(x_k)$$
$$0<c_1<c_2<1~(c_2=0.9~\text{for quasi-Newton})$$
$$c_1<0.5~(c_1=10^{-4})$$

## Constrained Form

### Background

  * Builds off of unconstrained methods, which solve for the vanilla necessary conditions in a Newton (or Newton-like) step
    * These do the same, but solve for the **KKT** necessary conditions, which provide machinery for both active and inactive constraints using Lagrange multipliers
    * Quadratic programming for quadratic cost functions
    * SQP or IP for nonlinear applications, in which we make a quadratic approximation of the problem, Newton step to solve KKT, repeat.
  * General form:

$$\text{minimize:}~~f(x)$$
$$\text{subject to:}~c_i(x)=0,~i\in \mathcal{E}$$
$$c_i(x)\leq 0,~i\in \mathcal{I}$$

### Lagrange Multipliers

#### Equality Constraints Only

At the optimum, your "engine" \\(\nabla f\\) can only take you into "forbidden" space, which is a linear combination of the gradients of \\(c_i\\):

$$\nabla f=-\sum_{i=1}^{m}\lambda_i\nabla c_i$$

with this fact, we can augment our cost to make the **Lagrangian** and derive a new set of necessary conditions surrounding it:

$$L(x,\lambda)=f+\sum_{i=1}^{m}\lambda_ic_i(x)=f(x)+\lambda^Tc(x)$$

First (necessary) condition, equivalent to two equations ago:

$$\frac{\partial L}{\partial x} = \nabla_xL=\nabla f+\lambda^T\nabla c=0$$

Second (necessary) condition, equivalent to equality constraints' being satisfied:

$$\frac{\partial L}{\partial \lambda}=c(x)=0$$

Those two conditions give \\(n+m\\) equations and \\(n+m\\) unknowns. **If you're solving these equations by hand, without a search method attached (better be a quadratic Lagrangian!),** you'll need to ensure that the following *sufficient* condition holds:

$$L_{xx}=\frac{\partial^2f}{\partial x^2}+\lambda^T\frac{\partial^2c}{\partial x^2}>0$$

#### Adding Inequality Constraints

Same principle, but now we can have *inactive* constraints whose gradients *don't contribute* to the space that the cost function's gradient is stuck in. This is accounted for with a clever "mixed-integer-like" math trick, giving the **KKT necessary conditions**:

$$\frac{\partial L}{\partial x}=0~\text{(Stationarity)}$$

$$c_i(x)=0, c_j(x)\leq 0~\text{(Primal Feasibility)}$$

$$\lambda_i\geq 0~\text{(Dual Feasibility)}$$

$$\lambda_jc_j(x)=0~\text{(Complementary Slackness)}$$

Redundant constraints make Lagrange multipliers not unique, causing some issues possibly (which \\(c\\) gradient basis vector to use to describe the gradient of \\(f\\)?).

Expected (absolute) objective gain can be calculated as \\(\Delta c_i(\lambda_i)\\).

## Scaling

The closer your variables' scales are to each other, the more well-conditioned your systems (like the KKT conditions arranged in a matrix) are going to be for solving.
