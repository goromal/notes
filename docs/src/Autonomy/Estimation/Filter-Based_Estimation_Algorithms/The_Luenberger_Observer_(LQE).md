# The Luenberger Observer (LQE)

The Luenberger Observer deals with estimating $\hat{\boldsymbol{x}}$ for linear *dynamic* systems, which adds a prediction step and linear constraints to the [linear static estimation problem](public:autonomy:search-optimization:least-squares#application_to_estimation).

You'll probably only ever implement the discrete-time version of the filter...

## Discrete-Time Luenberger Observer

### Overview

**Problem Statement:** Obtain the unbiased, minimum-variance linear estimate for $\boldsymbol{x}_k$ *in the steady-state limit* (or, in the case of pole-placement, simply satisfy some dynamic response specifications) given the sequence of measurements $\boldsymbol{y}_k$, subject to the dynamic and measurement models

$$\boldsymbol{x}_{k+1}=\boldsymbol{A}\boldsymbol{x}_k+\boldsymbol{B}\boldsymbol{u}_k + \boldsymbol{w}_k$$

$$\boldsymbol{y}_k=\boldsymbol{C}\boldsymbol{x}_k+\boldsymbol{v}_k$$

$$E[\boldsymbol{w}_k]=0,~E[\boldsymbol{v}_k]=0,~E[\boldsymbol{w}_j\boldsymbol{w}_k^T]=\boldsymbol{W}\delta_{jk},~E[\boldsymbol{v}_j\boldsymbol{v}_k^T]=\boldsymbol{V}\delta_{jk},~E[\boldsymbol{w}_k\boldsymbol{v}_j^T]=0$$

The solution filter takes the form

$$\hat{\boldsymbol{x}}_{k+1}=\boldsymbol{A}\hat{\boldsymbol{x}}_k+\boldsymbol{B}\boldsymbol{u}_k+\boldsymbol{L}(\boldsymbol{y}_k-\boldsymbol{C}\hat{\boldsymbol{x}}_k)$$

where $\boldsymbol{L}$ is constant throughout the estimation process. More on how to pick coefficient values later.

### Algorithm

  - *Initialization:* $\hat{\boldsymbol{x}}_0=\bar{\boldsymbol{x}}_0$, pre-compute $\boldsymbol{L}$
  - *State Propagation:* $\hat{\boldsymbol{x}}_{k+1}^-=\boldsymbol{A}\hat{\boldsymbol{x}}_{k}^++\boldsymbol{B}\boldsymbol{u}_k$
  - *Measurement Update:* $\hat{\boldsymbol{x}}_{k}^+=\hat{\boldsymbol{x}}_{k}^-+\boldsymbol{L}(\boldsymbol{y}_k-\boldsymbol{C}\hat{\boldsymbol{x}}_k^-)$

## Picking Coefficients for $\boldsymbol{L}$

### Pole Placement

Say we would like our closed-loop estimator $(\boldsymbol{A}-\boldsymbol{L}\boldsymbol{C})(\boldsymbol{x}(t)-\tilde{\boldsymbol{x}}(t))$ eigenvalues to be at

$$\lambda_1,\lambda_2,\cdots,\lambda_n$$

Giving a desired characteristic polynomial of

$$\phi_d(\lambda)=(\lambda-\lambda_1)(\lambda-\lambda_2)\cdots(\lambda-\lambda_n)$$

Then:

$$\boldsymbol{L}=\phi_d(\boldsymbol{A})\boldsymbol{\mathcal{M}}_O^{-1}\begin{bmatrix}0 \\ \vdots \\ 0 \\ 1\end{bmatrix},$$

where we have the observability matrix:

$$\boldsymbol{\mathcal{M}}_O=\begin{bmatrix}\boldsymbol{C}\\\boldsymbol{C}\boldsymbol{A}\\\boldsymbol{C}\boldsymbol{A}^2\\\vdots\\\boldsymbol{C}\boldsymbol{A}^{n-1}\end{bmatrix}$$

### Optimal Pole Placement: LQE

If the goal is indeed to minimize the variance of $\hat{\boldsymbol{x}}$ *in the limit*, then $\boldsymbol{L}$ comes from the solution to the Algebraic Ricatti Equation for observers:

$$\boldsymbol{A}\boldsymbol{Q}+\boldsymbol{Q}\boldsymbol{A}^T-\boldsymbol{Q}\boldsymbol{C}^T\boldsymbol{V}^{-1}\boldsymbol{C}\boldsymbol{Q}+\boldsymbol{W}=0$$

$$\boldsymbol{L}=\boldsymbol{Q}\boldsymbol{C}^T\boldsymbol{V}^{-1}$$
