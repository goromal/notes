# Least-Squares Optimization
## Why The 2-Norm?

The 2-norm, or \\(\lvert\lvert\cdot\rvert\rvert_2\\), is advantageous as a cost function for a number of reasons, including the following:

  * It often coincides with a useful physical interpretation (e.g., energy, power).
  * It is induced by the inner product \\(\langle\cdot,\cdot\rangle\\) operator((Inner product-induced norms expand outwards like n-dimensional spheres which, as they expand, come to touch vector spaces (i.e., "flat" spaces) at exactly *one* location, implying exactly *one* optimal solution. Hence their **convexity** when bounded by linear constraints (since the linear constraints provide the "flat" space).)).

A least-squares problem is, by definition, any optimization problem whose cost function is a 2-norm of some generalized **residual** function, \\(r(x)\\). Whether \\(r(x)\\) is linear or not (The residual equation is sometimes expressed as a constraint instead of in the cost function (rendering the cost function somewhat trivial), but usually not; both linear and nonlinear least-squares problems are generally considered to be a special case of [unconstrained nonlinear optimization problems](./Nonlinear_Optimization.md), for example.) will completely affect how the problem is approached and solved.

## Linear

Despite their name, linear least-squares problems are a subset of general unconstrained nonlinear optimization problems because of the nonlinear 2-norm operator. They're also referred to as **quadratic programs**. Their general form is

$$\min_x||r(x)||_2=\min_x||Ax-b||_2^2$$

with \\(A\in \mathbb{R}^{m\times n}\\). Optionally, a weighting matrix \\(Q\\) can be used:

$$\min_xr^\top Qr=\min_x||Q^{1/2}(Ax-b)||_2^2.$$
### Solution Methods

Because this is an unconstrained nonlinear problem, we could just use some greedy search method like steepest descent, where \\(F(x)=<r(x),r(x)>=(Ax-b)^\top(Ax-b)\\) and \\(g(x)=2A^\top(Ax-b)\\). However, we can and should take advantage of the fact that the cost function is induced by the inner product and that the residual function is describable using vector spaces in order to derive an analytical solution. After all, what linear least squares is really asking is what is the best \\(x^{\*}\\) such that \\(Ax^{\*}\\) is as close to \\(b\\) as possible, even if \\(b\\) is outside of the span of \\(A\\). The general solution to this problem utilizes the Moore-Penrose pseudoinverse of \\(A\\) (assuming full row rank):

$$x^*=A^\dagger b,$$

where the pseudoinverse is defined as

  * \\(m>n\\): \\(A^\dagger=(A^\top A)^{-1}A^\top\\)
    * Known as the *left inverse* (\\(A^\dagger A=I\\)), and exists when \\(A\\) is "tall," which will *most likely* be the case in learning problems, where you have linearly independent columns due to having more data points than variables. In this case, \\(A^\top A>0\\) is positive definite.
  * \\(m=n\\): \\(A^\dagger=A^{-1}\\)
    * The trivial case--doesn't happen very often
  * \\(m < n\\): \\(A^\dagger=A^\top(AA^\top)^{-1}\\)
    * Known as the *right inverse* (\\(AA^\dagger=I\\)), and exists when \\(A\\) is "fat," which usually shows up in high- or infinite-dimensional least-squares minimization problems (like optimal control) where you have far more variables than data points. In this case, \\(x^{\*}\\) is simply the \\(x\\) with the shortest 2-norm that satisfies \\(Ax=b\\).

Assuming that we want to calculate \\(x^{\*}\\) with the *left inverse*, how to do so efficiently? Here are two methods:

#### Cholesky Decomposition Method

Assuming \\(A^\top A>0\\) (again, given with the left inverse),

  - Find lower triangular \\(L\\) such that \\(A^\top A=LL^\top\\) (Cholesky decomposition)
  - Use \\(Ly=A^\top b\\) to obtain \\(y\\)
  - Use \\(L^\top x^*=y\\) to obtain \\(x^{\*}\\).

Faster than QR.

#### QR Decomposition Method

  - Find \\(Q\in \mathbb{R}^{n\times n},~Q^\top Q=I\\) and upper triangular \\(R\in\mathbb{R}^{n\times n}\\) such that \\(A^\top A=QR\\) (QR decomposition)
  - Solve \\(Rx^*=Q^\top A^\top b\\) via back substitution.

More numerically stable than Cholesky.
### Application to Estimation

Here, we focus on estimating quantities that don't evolve according to some modeled dynamics (unlike the Kalman Filter), so either a lot of measurements are going to help you estimate one static quantity or you are going to be trying to estimate a changing quantity at repeated snapshots, unable to take advantage of previous knowledge((There are least-squares-based estimation algorithms that also take advantage of previous solutions by using clever numerical tricks like exploiting the sparsity that shows up in SLAM problems as with [incremental smoothing](https://www.cs.cmu.edu/~kaess/pub/Kaess08tro.pdf).)).

**Problem Statement:** Estimate \\(\hat{x}\\) (with a prior estimate \\(x_0\\) covariance \\(Q_0\\)) when the differentiable, *linear* measurement model is 

$$y=Hx+v,~~v\sim \mathcal{N}(0,R)$$

Consider that the conditional probability density of a measurement given the state is expressed as

$$f(y|x)=\frac{1}{\alpha}e^{-\frac{1}{2}(y-Hx)^\top R^{-1}(y-Hx)}$$

Thus, to get the *maximum likelihood* estimation of \\(x\\), we need to *minimize the measurement error term* in the exponential:

$$J=\frac{1}{2}(y-Hx)^\top R^{-1}(y-Hx)$$

Or, if we’re adding a measurement update to a prior belief \\(x_0\\) with covariance \\(Q_0\\) to obtain the posterior with mean \\(\hat{x}\\) and covariance \\(Q_1\\):

$$J=\frac{1}{2}(\hat{x}-x_0)^\top Q_0^{-1}(\hat{x}-x_0)+\frac{1}{2}(y-H\hat{x})^\top R^{-1}(y-H\hat{x})$$

We can analytically minimize this cost function because of the linear measurement model by setting \\(\frac{\partial J}{\partial \hat{x}}=0\\):

$$\hat{x}=x_0+Q_1H^\top R^{-1}(y-Hx_0),~Q_1=(Q_0^{-1}+H^\top R^{-1}H)^{-1}$$

Note that if there were just the measurement without the prior in the cost function, differentiating and setting to zero like before would yield

$$\hat{x}=(H^\top R^{-1}H)^{-1}H^\top R^{-1}y=(R^{-1/2}H)^{-L}R^{-1/2}y$$

which, of course, is the *weighted* (by information/certainty, or inverse covariance) least squares solution to minimizing \\(R^{-1/2}(y-H\hat{x})\\). This makes sense, since the least squares cost function of the residual that’s linear in \\(x\\) (whether it’s a linear measurement model or matching the values of a polynomial that’s linear in the coefficient or parameter vector) is always minimized by projecting the observed measurement vector (or stack of measurement vectors) \\(y\\) (or, in this case, the scaled measurement vector \\(R^{-1/2}y\\)) from somewhere in the left null space onto the column space of whatever the (tall) linear operator \\(H\\) (or, in this weighted case, \\(R^{-1/2}H\\)) represents as an operator on \\(x\\) via the left Moore-Penrose pseudoinverse as expressed above.

So, the optimal \\(\hat{x}\\) is the one that makes the residual \\(y-H\hat{x}=y-\hat{y}\\) *orthogonal* to the column space or span of \\(H\\). Intuitively, when the goal is to minimize the variance of \\(\hat{x}\\), this occurs when all possible estimate information has been extracted from the measurements:

$$\tilde{x}\perp y \iff \tilde{x} \perp \hat{x} \iff E[\tilde{x}y^\top]=0$$

where the equivalence comes from the fact that with linear estimators, the estimate is a linear combination of the measurements. The intuition makes sense when you think about the orthogonal projection theorem applied to regular vectors. Thus, *an optimal linear estimator must satisfy the above relations*.


## Nonlinear

Nonlinear least-squares problems make no assumptions about the structure of the residual function, so they are not necessarily convex and are afforded none of the inner-product magic of linear least-squares for deriving an analytical solution. Their general form is 

$$\min_x||r(x)||_2^2,$$

where \\(r\\) is any nonlinear vector-valued function of \\(x\\). As with the linear case, a weighting matrix \\(Q\\) can be used.

### Solution Methods

The non-convexity of nonlinear least-squares problems demands an iterative solution, as with general unconstrained nonlinear optimization. Second-order Newton-based methods are again adopted here, where the Hessian needs to at least be approximated. Except for this time, the 2-norm does at least afford methods that are more efficient than BFGS and other general quasi-Newton algorithms. Two of the best known Newton-based methods tailored specifically to the nonlinear least-squares problem (in order of increasing effectiveness) are Gauss-Newton and Levenberg-Marquardt. More information can be found in Chapter 10 of [this reference](http://www.apmath.spbu.ru/cnsa/pdf/monograf/Numerical_Optimization2006.pdf) and [the Ceres Solver documentation](http://ceres-solver.org/nnls_solving.html).

#### Gauss-Newton

At a high level, Gauss-Newton repeatedly linearizes the vector-valued \\(r(x)\\) by computing the Jacobian \\(J(x)\\), and uses the magic analytical solution to linear least-squares to solve the miniature problem again and again. Using the same pseudoinverse operator defined with linear least squares, the recursive relation is

$$x_{k+1}=x_k-\alpha_kJ^\dagger r(x_k)$$

where the step size \\(\alpha_k\\) is determined via a line search (see [brief discussion on line searching for BFGS](./Nonlinear_Optimization.md)) to help with convergence. Alternatively, if \\(r(x)\triangleq y-f(x)\\) and \\(J\\) is the Jacobian of \\(f(x)\\), then the recursive relation is

$$x_{k+1}=x_k+\alpha_kJ^\dagger r(x_k).$$

#### Levenberg-Marquardt

Think about the case where the right inverse of \\(J\\) is needed for a Gauss-Newton iteration. This will happen in regions where the "local" Hessian is not positive definite, and thus \\(J^\top J\\) is not invertible. While \\(J^\dagger\\) will return *a* solution, that solution will not be unique. The Levenberg-Marquardt algorithm deals with this possibility using an *adaptive term*, \\(\lambda\\), to prevent instability:

$$x_{k+1}=x_k-\alpha_k(J^\top J+\lambda I)^{-1}J^\top R(x_k)$$

where \\(\lambda>0\\), evidently, can keep \\(J^\top J\\) positive definite. This term (also referred to as a "damping" term) allows for the dynamic transitioning between steepest-descent-like behavior (when far from an optimum) and Gauss-Newton behavior (when close to the optimum). Thus, at each iteration, \\(\lambda\\) can be shrunk as the cost reduction per iteration becomes larger.
### Application to Estimation

**Problem Statement:** (Iteratively) estimate \\(\hat{x}\\) (with a prior estimate \\(x_0\\) covariance \\(Q_0\\)) when the differentiable measurement model is 

$$y=h(x)+v,~~v\sim \mathcal{N}(0,R)$$

The only difference from the linear case is that we are acknowledging that \\(h\\) is nonlinear (with zero-mean Gaussian noise on the measurement). The objective function is then

$$J=(\hat{x}-x_0)^\top Q_0^{-1}(\hat{x}-x_0)+(y-h(\hat{x}))^\top R^{-1}(y-h(\hat{x}))$$

Note that the iterative/time construction isn't of necessity; we could be doing a single optimization with no \\(x_0\\), \\(Q_0\\), or a batch optimization with a bunch of stacked \\(y\\)'s (re-writable as a cost function adding many individual \\(y\\) costs). The following analysis generalizes to those cases, as well.

\\(J\\) can be minimized numerically by solvers like [Ceres](http://ceres-solver.org/) or [GTSAM](https://gtsam.org/), which will use a solver like Levenberg-Marquardt. If we wanted to solve it analytically, setting its derivative with respect to \\(\hat{x}\\) equal to zero yields the *necessary condition*:

$$2Q_0^{-1}(\hat{x}-x_0)-2H_\hat{x}^\top R^{-1}(y-h(\hat{x}))=0$$

where \\(H\_\hat{x}=\frac{\partial h}{\partial x}|\_\hat{x}\\) is the Jacobian of the measurement model at the optimum, implying a multi-dimensional linearization at \\(\hat{x}\\). Note that if your cost function just has a single measurement with no \\(x_0\\), then obviously the optimum is where \\(y=h(\hat{x})\\).

The equation above usually can't be solved analytically, but one option for iteratively solving is to first assume that \\(x_0\\) is close to \\(\hat{x}\\) such that \\(H\_{x\_0}\approx H\_{\hat{x}}\\), yielding the analytical expression:

$$\hat{x}=x_0+Q_1H_{x_0}^\top R_{-1}(y-h(x_0)),~Q_1=(Q_0^{-1}+H_{x_0}^\top R^{-1}H_{x_0})^{-1}$$

and then, repeatedly relinearizing about \\(\hat{x}\\), simplifying, and solving the necessary condition, the iteration equation is

$$\hat{x}\_{k+1}=\hat{x}\_k+Q\_{k+1}H\_{\hat{x}\_k}^\top R^{-1}(y-h(\hat{x}\_k))+Q\_{k+1}Q\_0^{-1}(x\_0-\hat{x}\_k),~Q\_{k+1}=(Q\_0^{-1}+H\_{\hat{x}\_k}^\top R^{-1}H\_{\hat{x}\_k})^{-1}$$

You'll know it's converged when the necessary condition holds true. But watch out! High levels of nonlinearity might lead to poor convergence properties since, for instance, the Jacobian could be iteratively calculated at non-optimal states such that it just keeps bouncing around and either doesn't converge or converges not at the minimum. Note, by the way, that this is the source of Ceres' [discussion of covariance estimation](http://ceres-solver.org/nnls_covariance.html). Relating the term for the covariance to the residual from the math above, a residual for Ceres is written as

$$r=Q^{-1/2}(y-h(\hat{x}))$$

since the cost function is formulated as \\(J=\sum\_i r\_i^\top R\_i\\).
