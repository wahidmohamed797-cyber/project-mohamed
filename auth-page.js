(function () {
    const form = document.getElementById("authForm");
    const title = document.getElementById("authTitle");
    const nameField = document.getElementById("displayNameField");
    const nameInput = document.getElementById("displayName");
    const submitButton = document.getElementById("authSubmit");
    const switchButton = document.getElementById("authSwitch");
    const passwordInput = document.getElementById("password");
    const status = document.getElementById("authStatus");
    const client = window.supabaseClient;
    let mode = "login";

    function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle("text-danger", isError);
        status.classList.toggle("text-success", !isError);
    }

    switchButton.addEventListener("click", function () {
        mode = mode === "login" ? "signup" : "login";
        title.textContent = mode === "login" ? "تسجيل الدخول" : "إنشاء حساب";
        submitButton.textContent = mode === "login" ? "دخول" : "إنشاء الحساب";
        switchButton.textContent = mode === "login"
            ? "ليس لديك حساب؟ أنشئ حسابًا"
            : "لديك حساب بالفعل؟ سجّل الدخول";
        nameField.hidden = mode === "login";
        nameInput.required = mode === "signup";
        passwordInput.autocomplete = mode === "login"
            ? "current-password"
            : "new-password";
        status.textContent = "";
        status.classList.remove("text-danger", "text-success");
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!client) {
            setStatus("خدمة تسجيل الدخول غير جاهزة. أعد تحميل الصفحة.", true);
            return;
        }

        submitButton.disabled = true;
        switchButton.disabled = true;
        status.textContent = "";
        status.classList.remove("text-danger", "text-success");

        try {
            const email = document.getElementById("email").value.trim();
            const password = passwordInput.value;
            let result;

            if (mode === "signup") {
                result = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        emailRedirectTo: window.location.href,
                        data: {
                            display_name: nameInput.value.trim()
                        }
                    }
                });
            } else {
                result = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });
            }

            if (result.error) {
                throw result.error;
            }

            if (mode === "signup" && !result.data.session) {
                setStatus("تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.", false);
                return;
            }

            window.location.replace("index.html");
        } catch (error) {
            console.error("Authentication request failed:", error);
            setStatus(error.message || "تعذر إكمال طلب تسجيل الدخول.", true);
        } finally {
            submitButton.disabled = false;
            switchButton.disabled = false;
        }
    });

    window.appAuthReady.then(function (session) {
        if (session) {
            window.location.replace("index.html");
        }
    });
})();
