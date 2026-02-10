# Filter-Based Estimation Algorithms

State estimation filters are all specializations and/or simplifications of the generic [Bayes Filter](../Applied_Statistics_for_Stochastic_Processes/Bayesian_Inference.md). They can be categorized according to the simplifying assumptions that they make about the processes they estimate:

## Linear Time Invariant (LTI) Dynamics

...

## Nonlinear Dynamics

...

## Absence of Dynamics

Bayesian estimation collapses to optimization algorithms like [Least Squares](../../Search_and_Optimization/Least-Squares_Optimization.md) in this case.

----

- https://chatgpt.com/c/68685947-d4f8-8009-831c-606ed61a1ff4 Ask chat: why is this more “statistically consistent?”
    - “The [EKF](https://ardupilot.org/dev/docs/extended-kalman-filter.html#extended-kalman-filter) instantiates multiple instances of the filter called ‘lanes’. The primary lane is the one that provides state estimates, rest are updated in the background and available for switching to. The number of possible lanes is exactly equal to the number of IMUs enabled for use. Conventionally, each lane uses the primary instance of the Airspeed, Barometer, GPS and Magnetometer sensors. The primary sensor can be set as a user-modifiable parameter, but can be later changed by the system, even in-flight, in case of a driver-level fault. However, modern-day vehicles are known to have multiple sensors installed of good quality. Affinity is a way for the EKF lanes to use non-primary sensors within any running lane. This provides a statistically consistent way to make use of multiple high quality sensors and use lane-switching to select the lane which has best performing combination of sensors. The lane error score takes into account innovations from all sensors used by a lane. This way, the vehicle can be saved from mishaps using noisy non-IMU sensors as well.”
- https://chatgpt.com/c/6765b5bb-9bc0-8009-8bc9-664714c4f0f9 mahony filter versus complementary filter https://ahrs.readthedocs.io/en/latest/filters/mahony.html **vs** https://ahrs.readthedocs.io/en/latest/filters/complementary.html
    - https://chatgpt.com/share/686b58db-f478-8009-8a58-0fd69de5732a
- Topics spanning all filter types:
    - Redundancy in filtering
        - What are algorithmic assumptions that redundancy can break?
            - Continuity / smoothness
            - Statistical consistency: properly representing the statistical distribution of your input (often in parametric form) to your downstream consumer
                - What this really gets down to is your ability to accurately represent probability in your filter. For the KF, you are restricted to unbiased Gaussian probabilities, whereas with a Particle filter you can define an arbitrarily complex likelihood function in theory. And complementary filter works as well for the opposite reason: it doesn’t know (or care) about the statistical model of your input. It does not claim to be analytically optimal.
        - Depending on the consumer, some of these assumptions may or may not be pertinent or binding