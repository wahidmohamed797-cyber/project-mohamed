(function () {
    const config = window.SUPABASE_CONFIG;
    const publicPage = document.body.dataset.publicPage === "true";

    function showError(message) {
        let status = document.getElementById("authStatus");

        if (!status) {
            status = document.createElement("div");
            status.id = "authStatus";
            status.className = "auth-runtime-error";
            status.setAttribute("role", "alert");
            document.body.replaceChildren(status);
        }

        status.textContent = message;
    }

    function getLoginPath() {
        return window.location.pathname.includes("/pages/")
            ? "../auth.html"
            : "auth.html";
    }

    window.appAuthReady = Promise.resolve(null);

    if (
        !config ||
        !config.url ||
        !config.publishableKey ||
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {
        document.documentElement.classList.remove("auth-checking");
        document.documentElement.classList.remove("app-loading");
        showError("تعذر تحميل خدمة تسجيل الدخول. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.");
        return;
    }

    let client;

    try {
        client = window.supabase.createClient(
            config.url,
            config.publishableKey
        );
    } catch (error) {
        console.error("Authentication client setup failed:", error);
        document.documentElement.classList.remove("auth-checking");
        document.documentElement.classList.remove("app-loading");
        showError("تعذر إعداد الاتصال بـ Supabase. تحقق من رابط المشروع والمفتاح العام.");
        return;
    }

    window.supabaseClient = client;
    client.auth.onAuthStateChange(function (event) {
        if (event === "SIGNED_OUT" && !publicPage) {
            window.location.replace(getLoginPath());
        }
    });

    window.appAuthReady = client.auth.getSession()
        .then(function (result) {
            if (result.error) {
                throw result.error;
            }

            const session = result.data.session;

            if (publicPage) {
                document.documentElement.classList.remove("auth-checking");
                return session;
            }

            if (!session) {
                window.location.replace(getLoginPath());
                return null;
            }

            document.documentElement.classList.remove("auth-checking");
            addAccountControls(client, session);
            return session;
        })
        .catch(function (error) {
            console.error("Authentication initialization failed:", error);
            document.documentElement.classList.remove("auth-checking");
            document.documentElement.classList.remove("app-loading");
            showError("تعذر التحقق من جلسة الدخول. أعد تحميل الصفحة، وإذا استمرت المشكلة تحقق من إعدادات Supabase.");
            return null;
        });

    function addAccountControls(authClient, session) {
        const toolbar = document.createElement("div");
        toolbar.className = "account-toolbar";

        const email = document.createElement("span");
        email.textContent = session.user.email || "حسابك";

        const logoutButton = document.createElement("button");
        logoutButton.type = "button";
        logoutButton.className = "btn btn-sm btn-outline-light";
        logoutButton.textContent = "تسجيل الخروج";
        logoutButton.addEventListener("click", async function () {
            logoutButton.disabled = true;
            const result = await authClient.auth.signOut();

            if (result.error) {
                logoutButton.disabled = false;
                console.error("Sign-out failed:", result.error);
                window.alert("تعذر تسجيل الخروج: " + result.error.message);
                return;
            }

            window.location.replace(getLoginPath());
        });

        toolbar.append(email, logoutButton);
        document.body.appendChild(toolbar);
    }
})();
