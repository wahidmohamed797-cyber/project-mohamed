(function () {
    const config = window.SUPABASE_CONFIG;
    const publicPage = document.body.dataset.publicPage === "true";
    window.isPasswordRecovery =
        new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";

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
        const accountEmail = document.getElementById("settingsAccountEmail");
        if (accountEmail) {
            accountEmail.textContent = session.user.email || "حسابك";
        }

        const logoutButton = document.getElementById("logoutButton");
        if (!logoutButton) {
            return;
        }

        const logoutStatus = document.getElementById("logoutStatus");
        logoutButton.addEventListener("click", async function () {
            logoutButton.disabled = true;
            if (logoutStatus) {
                logoutStatus.hidden = true;
                logoutStatus.textContent = "";
            }
            try {
                const result = await authClient.auth.signOut();
                if (result.error) {
                    throw result.error;
                }
            } catch (error) {
                logoutButton.disabled = false;
                console.error("Sign-out failed:", error);
                if (logoutStatus) {
                    logoutStatus.textContent = "تعذر تسجيل الخروج: " + error.message;
                    logoutStatus.hidden = false;
                }
            }
        });
    }
})();
