type Route = {
    path: string;
    component: () => HTMLElement;
};

/**
 * SimpleRouter provides basic client-side routing for single-page applications.
 *
 * Features:
 * - Register routes with `add(path, component)`, mapping URL paths to components.
 * - Navigate programmatically using `go(path)`, updating the browser URL and rendering the matching component.
 * - Handles browser navigation events (`popstate`) to re-render the correct component when the user uses back/forward.
 * - Renders the selected route's component into the DOM element with id `app`.
 * - Displays a default or custom "not found" component if no route matches the current path.
 *
 * Usage:
 * - Import the router and add routes.
 * - Optionally set a custom "not found" component.
 * - Use `go(path)` for navigation.
 * - The router automatically handles initial and subsequent renders.
 */

class SimpleRouter {
    private readonly routes: Route[] = [];
    private notFound: () => HTMLElement = () => {
        const el = document.createElement('div');
        el.textContent = 'Page not found';
        return el;
    };

    constructor() {
        window.addEventListener('popstate', () => this.render());
        this.render(); // Initial render
    }

    // Add a route with a path and component
    add(path: string, component: () => HTMLElement) {
        this.routes.push({ path, component });
    }

    // Set a custom "not found" component
    setNotFound(component: () => HTMLElement) {
        this.notFound = component;
    }

    // Navigate to a path
    go(path: string) {
        window.history.pushState({}, '', path);
        this.render();
    }

    // Render the current route
    render() {
        const currentPath = window.location.pathname;
        const route = this.routes.find(r => r.path === currentPath);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '';
            app.appendChild(route ? route.component() : this.notFound());
        }
    }
}

export const router = new SimpleRouter();