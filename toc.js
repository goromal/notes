// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Andrew&#39;s Notes</a></li><li class="chapter-item expanded "><a href="Recipes.html"><strong aria-hidden="true">2.</strong> Recipes</a></li><li class="chapter-item expanded "><a href="Tenet_Timelines.html"><strong aria-hidden="true">3.</strong> Tenet Timelines</a></li><li class="chapter-item expanded "><a href="Money_Balancing_Math.html"><strong aria-hidden="true">4.</strong> Money Balancing Math</a></li><li class="chapter-item expanded "><a href="Autonomy/Autonomy.html"><strong aria-hidden="true">5.</strong> Autonomy</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Search_and_Optimization/Search_and_Optimization.html"><strong aria-hidden="true">5.1.</strong> Search and Optimization</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Search_and_Optimization/Least-Squares_Optimization.html"><strong aria-hidden="true">5.1.1.</strong> Least-Squares Optimization</a></li><li class="chapter-item expanded "><a href="Autonomy/Search_and_Optimization/Nonlinear_Optimization.html"><strong aria-hidden="true">5.1.2.</strong> Nonlinear Optimization</a></li><li class="chapter-item expanded "><a href="Autonomy/Search_and_Optimization/Optimization_Over_Lie_Groups.html"><strong aria-hidden="true">5.1.3.</strong> Optimization Over Lie Groups</a></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Estimation/Estimation.html"><strong aria-hidden="true">5.2.</strong> Estimation</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Estimation/Filter-Based_Estimation_Algorithms/Filter-Based_Estimation_Algorithms.html"><strong aria-hidden="true">5.2.1.</strong> Filter-Based Estimation Algorithms</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Estimation/Filter-Based_Estimation_Algorithms/The_Kinematic_Filters.html"><strong aria-hidden="true">5.2.1.1.</strong> The Kinematic Filters</a></li><li class="chapter-item expanded "><a href="Autonomy/Estimation/Filter-Based_Estimation_Algorithms/The_Luenberger_Observer_(LQE).html"><strong aria-hidden="true">5.2.1.2.</strong> The Luenberger Observer (LQE)</a></li><li class="chapter-item expanded "><a href="Autonomy/Estimation/Filter-Based_Estimation_Algorithms/The_Kalman_Filter_(Time-Varying_LQE).html"><strong aria-hidden="true">5.2.1.3.</strong> The Kalman Filter (Time-Varying LQE)</a></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Estimation/Applied_Statistics_for_Stochastic_Processes/Applied_Statistics_for_Stochastic_Processes.html"><strong aria-hidden="true">5.2.2.</strong> Applied Statistics for Stochastic Processes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Estimation/Applied_Statistics_for_Stochastic_Processes/Bayesian_Inference.html"><strong aria-hidden="true">5.2.2.1.</strong> Bayesian Inference</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Systems_Implementation.html"><strong aria-hidden="true">5.3.</strong> Systems Implementation</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Computer_Simulations/Computer_Simulations.html"><strong aria-hidden="true">5.3.1.</strong> Computer Simulations</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Computer_Simulations/The_Inertial_Measurement_Unit_(IMU)_Sensor.html"><strong aria-hidden="true">5.3.1.1.</strong> The Inertial Measurement Unit (IMU) Sensor</a></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Computer_Simulations/Event-Based_Collision_Detection.html"><strong aria-hidden="true">5.3.1.2.</strong> Event-Based Collision Detection</a></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Computer_Simulations/The_Rotor_Blade_Flapping_Effect.html"><strong aria-hidden="true">5.3.1.3.</strong> The Rotor Blade Flapping Effect</a></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Optimization_Libraries/Optimization_Libraries.html"><strong aria-hidden="true">5.3.2.</strong> Optimization Libraries</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Optimization_Libraries/2D_Range-Bearing_Landmark_Resolution_with_Ceres.html"><strong aria-hidden="true">5.3.2.1.</strong> 2D Range-Bearing Landmark Resolution with Ceres</a></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Implementation/Optimization_Libraries/Ceres_Solver_Python_Tutorial.html"><strong aria-hidden="true">5.3.2.2.</strong> Ceres Solver Python Tutorial</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Systems_Theory/Systems_Theory.html"><strong aria-hidden="true">5.4.</strong> Systems Theory</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Systems_Theory/Signals/Signals.html"><strong aria-hidden="true">5.4.1.</strong> Signals</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Systems_Theory/Signals/Algorithms_in_Continuous_vs_Discrete_Time.html"><strong aria-hidden="true">5.4.1.1.</strong> Algorithms in Continuous vs Discrete Time</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Math_Fundamentals/Math_Fundamentals.html"><strong aria-hidden="true">5.5.</strong> Math Fundamentals</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Math_Fundamentals/3D_Geometry/3D_Geometry.html"><strong aria-hidden="true">5.5.1.</strong> 3D Geometry</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Math_Fundamentals/3D_Geometry/Rotations_Robotics_Field_Guide.html"><strong aria-hidden="true">5.5.1.1.</strong> Rotations Robotics Field Guide</a></li></ol></li><li class="chapter-item expanded "><a href="Autonomy/Math_Fundamentals/Linear_Algebra/Linear_Algebra.html"><strong aria-hidden="true">5.5.2.</strong> Linear Algebra</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Autonomy/Math_Fundamentals/Linear_Algebra/Visualizing_Matrices.html"><strong aria-hidden="true">5.5.2.1.</strong> Visualizing Matrices</a></li></ol></li></ol></li></ol></li><li class="chapter-item expanded "><a href="Philosophy_Essays/Philosophy_Essays.html"><strong aria-hidden="true">6.</strong> Philosophy Essays</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Philosophy_Essays/Thomas_Aquinas_on_Reason_and_Revelation.html"><strong aria-hidden="true">6.1.</strong> Thomas Aquinas on Reason and Revelation</a></li><li class="chapter-item expanded "><a href="Philosophy_Essays/Realism_vs_Nominalism.html"><strong aria-hidden="true">6.2.</strong> Realism vs Nominalism</a></li><li class="chapter-item expanded "><a href="Philosophy_Essays/Aristotelian_Science.html"><strong aria-hidden="true">6.3.</strong> Aristotelian Science</a></li></ol></li><li class="chapter-item expanded "><a href="Software_Runbooks/Software_Runbooks.html"><strong aria-hidden="true">7.</strong> Software Runbooks</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="Software_Runbooks/Avahi_Runbook.html"><strong aria-hidden="true">7.1.</strong> Avahi Runbook</a></li><li class="chapter-item expanded "><a href="Software_Runbooks/Metrics_Pipeline_Debugging.html"><strong aria-hidden="true">7.2.</strong> Metrics Pipeline Debugging</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
