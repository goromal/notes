# Optimization Over Lie Groups

### Birds-Eye View

Optimization methods incorporating Lie Groups are, by definition, nonlinear. Thus, the focus here is on nonlinear "local search" methods and adapting them to accommodate state vectors \\(\boldsymbol{x}\\) containing at least one Lie group component:

$$\boldsymbol x\in \mathbb{R}^n\times \mathcal{M} \times \cdots.$$

Acknowledging that a state vector can contain both vector and group components, define the following composite addition and subtraction operators:

$$\boldsymbol{a}\boxplus\boldsymbol{b}=\begin{cases}
(\boldsymbol{a}+\boldsymbol{b})\in \mathbb{R}^n & \boldsymbol{a},\boldsymbol{b}\in\mathbb{R}^{n}\\
(\boldsymbol{a}\oplus\boldsymbol{b})\in \mathcal{M} & \boldsymbol{a}\in\mathcal{M},\boldsymbol{b}\in \mathbb{R}^m \cong \mathfrak{m}
\end{cases}$$

$$\boldsymbol{a}\boxminus\boldsymbol{b}=\begin{cases}
(\boldsymbol{a}-\boldsymbol{b})\in \mathbb{R}^n & \boldsymbol{a},\boldsymbol{b}\in\mathbb{R}^{n}\\
(\boldsymbol{a}\ominus\boldsymbol{b})\in \mathbb{R}^m\cong \mathfrak{m} & \boldsymbol{a},\boldsymbol{b}\in\mathbb{\mathcal{M}}
\end{cases}$$

Local search, as the name suggests, utilizes the *local, right-* versions of the \\(\oplus\\) and \\(\ominus\\) operators, as well as *right-Jacobians*.
### Lie-ify Your Optimization Algorithm

Local, iterative search algorithms (as with [nonlinear least squares](public:autonomy:search-optimization:least-squares#nonlinear)) take the following form when \\(\boldsymbol x\\) belongs to a vector space:

$$\boldsymbol x_{k+1}=\boldsymbol x_k+\boldsymbol{\Delta x},~\boldsymbol{\Delta x}=f(\boldsymbol{x}_k,\boldsymbol J(\boldsymbol x_k))\in \mathbb{R}^n,$$

where \\(\boldsymbol J(\boldsymbol x_k)\\) is the Jacobian of the residual function, \\(r(\boldsymbol{x}_k)\\).

Acknowledging that the state can contain Lie group components, the above must be modified to:

$$\boldsymbol x_{k+1}=\boldsymbol x_k\boxplus\boldsymbol{\Delta x},~\boldsymbol{\Delta x}=f(\boldsymbol{x}_k,\boldsymbol J(\boldsymbol x_k))\in \mathbb{R}^n\times \mathbb{R}^m\cong \mathfrak{m}\times \cdots.$$

In essence, to perform local search with a state that evolves on the manifold, the following three steps must be taken:

  - Ensure that \\(r(\boldsymbol x)\\) returns a vector (doesn't necessarily *have* to be this way, but it makes things much more straightforward).
  - Be able to calculate \\(\boldsymbol J(\boldsymbol x_k)\\), which may contain both Jacobian terms over vector spaces as well as Jacobian terms on the manifold. An example below.
  - Ensure that, for your formulation, \\(f(\boldsymbol{x}_k,\boldsymbol J(\boldsymbol x_k))\\) also returns a vector, but *with components that are isomorphic to a Lie algebra* (i.e., \\(\mathbb{R}^m\cong \mathfrak{m}\\)) where appropriate so that the \\(\boxplus\\) operation makes sense.

If you can do those three things, then your optimization will behave as any other local search over vector spaces.


### Examples

#### Simple "Mixed" Jacobian Example

Say that your state vector looks like

$$\boldsymbol x=\begin{bmatrix}\boldsymbol p\\\ \boldsymbol{R}\end{bmatrix}\in \mathbb{R}^3 \times SO(3),$$

and your residual function is

$$r(\boldsymbol x)=\begin{bmatrix}\boldsymbol p_\text{measured}-\boldsymbol p\\\ \boldsymbol R_\text{measured}\boldsymbol R^{-1}\end{bmatrix}\triangleq \begin{bmatrix}r_1(\boldsymbol x)\\\r_2(\boldsymbol x)\end{bmatrix}.$$

The Jacobian matrix will then look like

$$\boldsymbol J=\begin{bmatrix}\frac{\partial r_1}{\partial \boldsymbol p} & \frac{\partial r_1}{\partial \boldsymbol R} \\\ \frac{\partial r_2}{\partial \boldsymbol p} & \frac{\partial r_2}{\partial \boldsymbol R}\end{bmatrix}\in \mathbb{R}^{6\times 6},$$

where the Jacobians \\(\partial r_1/\partial \boldsymbol R\\) and \\(\partial r_2/\partial \boldsymbol R\\) are the (nontrivial) right-Jacobians on the manifold, which must be calculated as explained in the [Jacobians](autonomy:math:manifold-calculus:lie-fundamentals#jacobians) section and demonstrated in the next example.

#### Gauss-Newton for a Nonlinear Least-Squares Problem

Suppose we want to derive the Gauss-Newton recursive update step for the nonlinear least-squares problem

$$\min_{\boldsymbol T\in SE(3)}\frac{1}{n}\sum_{i=1}^n\text{Tr}((\boldsymbol T-\boldsymbol T_i)^T(\boldsymbol T-\boldsymbol T_i)),$$

where \\(\boldsymbol T_i\\) are a series of \\(n\\) pose measurements. Let's go through the three steps for formulating local search on the manifold:

***1:** Ensure that the residual function returns a vector.*

Defining \\(\boldsymbol x\triangleq \boldsymbol T\in SE(3)\\), we want the optimization above to look like:

$$\min_{\boldsymbol x}r(\boldsymbol x)^Tr(\boldsymbol x)$$

where \\(r(\boldsymbol x)\\) returns a vector. We'll do that now:

$$\frac{1}{n}\sum_{i=1}^n\text{Tr}((\boldsymbol T-\boldsymbol T_i)^T(\boldsymbol T-\boldsymbol T_i))=\text{vec}\left(\frac{1}{n}\sum_{i=1}^n(\boldsymbol T-\boldsymbol T_i)\right)^T\text{vec}\left(\frac{1}{n}\sum_{i=1}^n(\boldsymbol T-\boldsymbol T_i)\right)$$

$$=\text{vec}\left(\boldsymbol T-\bar{\boldsymbol{T}} \right)^T\text{vec}\left( \boldsymbol T-\bar{\boldsymbol{T}}\right)=\text{vec}\left(\begin{bmatrix}\boldsymbol{R}-\bar{\boldsymbol{R}} & \boldsymbol{p}-\bar{\boldsymbol{p}}\\\ \boldsymbol{0} & \boldsymbol{1}\end{bmatrix} \right)^T\text{vec}\left(\begin{bmatrix}\boldsymbol{R}-\bar{\boldsymbol{R}} & \boldsymbol{p}-\bar{\boldsymbol{p}}\\\ \boldsymbol{0} & \boldsymbol{1}\end{bmatrix} \right),$$

where \\(\bar{\cdot}\\) indicates the average value over \\(n\\) samples. Throw out the constants (which don't affect the optimization) to save some space, and you have a concise definition for an equivalent vector-valued residual function:

$$r(\boldsymbol x)\triangleq \begin{bmatrix}\boldsymbol{p}-\bar{\boldsymbol{p}} \\\ \boldsymbol R-\bar{\boldsymbol{R}})\boldsymbol e_1 \\\ (\boldsymbol R-\bar{\boldsymbol{R}})\boldsymbol e_2 \\\ (\boldsymbol R-\bar{\boldsymbol{R}})\boldsymbol e_3\end{bmatrix}~:~SE(3)\rightarrow \mathbb{R}^{12}.$$


***2:** Calculate the Jacobian matrix of the residual function.*

Most Jacobian elements can be trivially calculated as

$$\boldsymbol J=\begin{bmatrix} \partial r_1/\partial \boldsymbol p & \partial r_1/\partial \boldsymbol \theta \\\ \partial r_2/\partial \boldsymbol p & \partial r_2/\partial \boldsymbol \theta \\\ \partial r_3/\partial \boldsymbol p & \partial r_3/\partial \boldsymbol \theta \\\ \partial r_4/\partial \boldsymbol p & \partial r_4/\partial \boldsymbol \theta \end{bmatrix}=\begin{bmatrix}\boldsymbol I & \boldsymbol 0\\\ \boldsymbol 0 & \partial r_2/\partial \boldsymbol \theta\\\ \boldsymbol 0 & \partial r_3/\partial \boldsymbol \theta \\\ \boldsymbol 0 & \partial r_4/\partial \boldsymbol \theta\end{bmatrix}.$$

The remaining Jacobian blocks must be calculated on the manifold:

$$\frac{\partial r_2}{\partial \boldsymbol\theta}=\lim_{\boldsymbol \theta\rightarrow \boldsymbol{0}}\frac{r_2(\boldsymbol R \oplus \boldsymbol \theta)-r_2(\boldsymbol R)}{\boldsymbol \theta}$$

(...note the regular minus \\(-\\) sign in the numerator, since \\(r\\) returns a vector and thus \\(\ominus\\) is not necessary...)

$$=\lim_{\boldsymbol{\theta}\rightarrow \boldsymbol{0}}\frac{(\boldsymbol R \text{Exp}\boldsymbol \theta-\bar{\boldsymbol{R}})\boldsymbol e_1-(\boldsymbol{R}-\bar{\boldsymbol{R}})\boldsymbol e_1}{\boldsymbol \theta}=\lim_{\boldsymbol \theta\rightarrow \boldsymbol{0}}\frac{\boldsymbol R(\text{Exp}\boldsymbol \theta-\boldsymbol I)\boldsymbol e_1}{\boldsymbol \theta}$$

$$\approx\lim_{\boldsymbol{\theta}\rightarrow \boldsymbol{0}}\frac{\boldsymbol{R}[\boldsymbol{\theta}]_\times\boldsymbol e_1}{\boldsymbol \theta}$$

$$=\lim_{\boldsymbol{\theta}\rightarrow \boldsymbol{0}}\frac{-\boldsymbol{R}[\boldsymbol e_1]_{\times}\boldsymbol{\theta}}{\boldsymbol{\theta}}$$

$$=-\boldsymbol{R}[\boldsymbol e_1]_\times.$$

$$\vdots$$

$$\boldsymbol{J} = \begin{bmatrix} \boldsymbol{I} & \boldsymbol{0} \\\ \boldsymbol{0} & -\boldsymbol{R}[\boldsymbol e_1]_\times \\\ \boldsymbol{0} & -\boldsymbol{R}[\boldsymbol e_2]_\times \\\ \boldsymbol{0} & -\boldsymbol{R}[\boldsymbol e_3]_\times \end{bmatrix} \in \mathbb{R}^{12 \times 6}.$$

***3:** Check that the \\(\boxplus\\) operation makes sense.*

For a Gauss-Newton update step, the recursive relation is

$$\boldsymbol x_{k+1}=\boldsymbol x_k \boxplus \alpha_k \boldsymbol J^\dagger r(\boldsymbol{x}_k),$$

so that means that we have the requirement

$$\boldsymbol J^\dagger r(\boldsymbol{x}_k)\in \mathbb{R}^6 \cong \mathfrak{se}(3).$$

Carrying out the pseudoinverse expansion of \\(\boldsymbol J^\dagger\\) and multiplying with \\(r\\) will indeed verify that the dimensions are all correct.
