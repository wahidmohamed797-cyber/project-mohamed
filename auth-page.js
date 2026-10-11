(function () {
    const form = document.getElementById("authForm");
    const title = document.getElementById("authTitle");
    const nameField = document.getElementById("displayNameField");
    const nameInput = document.getElementById("displayName");
    const emailField = document.getElementById("emailField");
    const emailInput = document.getElementById("email");
    const passwordField = document.getElementById("passwordField");
    const submitButton = document.getElementById("authSubmit");
    const switchButton = document.getElementById("authSwitch");
    const forgotButton = document.getElementById("forgotPassword");
    const passwordInput = document.getElementById("password");
    const passwordVisibilityButton = document.getElementById("passwordVisibility");
    const confirmPasswordField = document.getElementById("confirmPasswordField");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const confirmPasswordVisibilityButton = document.getElementById("confirmPasswordVisibility");
    const status = document.getElementById("authStatus");
    const loadingOverlay = document.getElementById("authLoading");
    const loadingMessage = document.getElementById("authLoadingMessage");
    const client = window.supabaseClient;
    let mode = window.isPasswordRecovery ? "recovery" : "login";

    function bindPasswordVisibility(button, input) {
        button.addEventListener("click", function () {
            const shouldShow = input.type === "password";
            input.type = shouldShow ? "text" : "password";
            button.setAttribute("aria-pressed", String(shouldShow));
            button.setAttribute(
                "aria-label",
                shouldShow ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            );
            button.title = shouldShow ? "إخفاء كلمة المرور" : "إظهار كلمة المرور";
            button.querySelector("i").className = shouldShow ? "bi bi-eye-slash" : "bi bi-eye";
        });
    }

    function setLoading(isLoading, message) {
        loadingOverlay.hidden = !isLoading;
        loadingOverlay.setAttribute("aria-hidden", String(!isLoading));
        form.setAttribute("aria-busy", String(isLoading));
        submitButton.disabled = isLoading;
        switchButton.disabled = isLoading;
        forgotButton.disabled = isLoading;
        if (isLoading) {
            loadingMessage.textContent = message;
        }
    }

    function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle("text-danger", isError);
        status.classList.toggle("text-success", !isError);
    }

    function clearStatus() {
        status.textContent = "";
        status.classList.remove("text-danger", "text-success");
    }

    function updateView() {
        const login = mode === "login";
        const signup = mode === "signup";
        const forgot = mode === "forgot";
        const recovery = mode === "recovery";
        const passwordRecovery = forgot || recovery;

        title.textContent = signup
            ? "إنشاء حساب"
            : forgot
                ? "استعادة كلمة المرور"
                : recovery
                    ? "تعيين كلمة مرور جديدة"
                    : "تسجيل الدخول";
        submitButton.textContent = signup
            ? "إنشاء الحساب"
            : forgot
                ? "إرسال رابط الاستعادة"
                : recovery
                    ? "حفظ كلمة المرور الجديدة"
                    : "دخول";
        nameField.hidden = !signup;
        nameInput.required = signup;
        emailField.hidden = recovery;
        emailInput.required = !recovery;
        passwordField.hidden = forgot;
        passwordInput.required = !forgot;
        passwordInput.autocomplete = login
            ? "current-password"
            : "new-password";
        confirmPasswordField.hidden = !recovery;
        confirmPasswordInput.required = recovery;
        forgotButton.hidden = !login;
        switchButton.hidden = forgot || recovery;
        switchButton.textContent = signup
            ? "لديك حساب بالفعل؟ سجّل الدخول"
            : "ليس لديك حساب؟ أنشئ حسابًا";
        document.querySelector(".auth-description").textContent = passwordRecovery
            ? "اتبع الخطوات لاستعادة الوصول إلى حسابك."
            : "سجّل الدخول لإدارة مساحة عملك.";
        clearStatus();
    }

    bindPasswordVisibility(passwordVisibilityButton, passwordInput);
    bindPasswordVisibility(confirmPasswordVisibilityButton, confirmPasswordInput);

    switchButton.addEventListener("click", function () {
        mode = mode === "login" ? "signup" : "login";
        updateView();
    });

    forgotButton.addEventListener("click", function () {
        mode = "forgot";
        updateView();
    });

    updateView();

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!client) {
            setStatus("خدمة تسجيل الدخول غير جاهزة. أعد تحميل الصفحة.", true);
            return;
        }

        const loadingMessages = {
            login: "جارٍ تسجيل الدخول...",
            signup: "جارٍ إنشاء الحساب...",
            forgot: "جارٍ إرسال رابط الاستعادة...",
            recovery: "جارٍ تحديث كلمة المرور..."
        };
        let redirecting = false;
        setLoading(true, loadingMessages[mode]);
        clearStatus();

        try {
            const email = document.getElementById("email").value.trim();
            const password = passwordInput.value;
            let result;

            if (mode === "forgot") {
                result = await client.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + window.location.pathname
                });
            } else if (mode === "recovery") {
                if (password !== confirmPasswordInput.value) {
                    throw new Error("كلمتا المرور غير متطابقتين.");
                }
                result = await client.auth.updateUser({ password: password });
            } else if (mode === "signup") {
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

            if (mode === "forgot") {
                setStatus("إذا كان البريد مسجلًا، فسيصلك رابط لاستعادة كلمة المرور. تحقق من صندوق الوارد والرسائل غير المرغوب فيها.", false);
                return;
            }

            if (mode === "recovery") {
                setStatus("تم تحديث كلمة المرور. سيتم فتح مساحة العمل.", false);
                window.setTimeout(function () {
                    window.location.replace("index.html");
                }, 700);
                return;
            }

            if (mode === "signup" && !result.data.session) {
                setStatus("تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.", false);
                return;
            }

            redirecting = true;
            window.location.replace("index.html");
        } catch (error) {
            console.error("Authentication request failed:", error);
            setStatus(error.message || "تعذر إكمال طلب تسجيل الدخول.", true);
        } finally {
            if (!redirecting) {
                setLoading(false);
            }
        }
    });

    window.appAuthReady.then(function (session) {
        if (session && mode !== "recovery") {
            window.location.replace("index.html");
        }
    });
})();
