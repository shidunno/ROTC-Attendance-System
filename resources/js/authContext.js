const STORAGE_KEY = 'rotc-auth-context';
const CONTEXT_PATTERN = /^[a-f0-9-]{32,64}$/i;
const INSTANCE_ID = crypto.randomUUID();

let channel = null;

function createContextId() {
    return crypto.randomUUID();
}

function setContextInUrl(contextId) {
    const url = new URL(window.location.href);

    if (url.searchParams.get('tab') !== contextId) {
        url.searchParams.set('tab', contextId);

        window.history.replaceState(
            window.history.state,
            '',
            url
        );
    }
}

function getStoredContext() {
    try {
        const stored = window.sessionStorage.getItem(STORAGE_KEY);

        if (stored && CONTEXT_PATTERN.test(stored)) {
            return stored;
        }
    } catch {
        // Fall through to a new context if storage is unavailable.
    }

    return null;
}

function storeContext(contextId) {
    try {
        window.sessionStorage.setItem(
            STORAGE_KEY,
            contextId
        );
    } catch {
        // The current document can still use the in-memory context.
    }

    return contextId;
}

let authContext = getStoredContext();

if (!authContext) {
    const urlContext = new URL(window.location.href)
        .searchParams
        .get('tab');

    authContext =
        urlContext && CONTEXT_PATTERN.test(urlContext)
            ? storeContext(urlContext)
            : storeContext(createContextId());
}

if (
    typeof window !== 'undefined' &&
    'BroadcastChannel' in window
) {
    channel = new BroadcastChannel(
        'rotc-auth-context'
    );

    channel.addEventListener(
        'message',
        (event) => {
            const message = event.data;

            if (
                !message ||
                message.type !== 'rotc-context-claim' ||
                message.contextId !== authContext ||
                message.instanceId === INSTANCE_ID
            ) {
                return;
            }

            // If a duplicated tab cloned sessionStorage, give the
            // existing context to the older instance and move the
            // newer document to a fresh context.
            if (
                INSTANCE_ID >
                message.instanceId
            ) {
                authContext = storeContext(
                    createContextId()
                );

                setContextInUrl(authContext);

                channel.postMessage({
                    type: 'rotc-context-changed',
                    oldContextId:
                        message.contextId,
                    instanceId:
                        INSTANCE_ID,
                });
            }
        }
    );

    channel.postMessage({
        type: 'rotc-context-claim',
        contextId: authContext,
        instanceId: INSTANCE_ID,
    });
}

setContextInUrl(authContext);

export function getAuthContext() {
    return authContext;
}

export function getAuthContextHeader() {
    return {
        'X-ROTC-Auth-Context':
            getAuthContext(),
    };
}

export function persistAuthContextInUrl() {
    setContextInUrl(
        getAuthContext()
    );
}