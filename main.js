const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const members = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const member = ref({});
        const username = new URLSearchParams(window.location.search).get('username');
        const roles = {
            "nacreousdawn596": "Manager",
            "estelle_maybe": "Owner (also the Queen)",
            "tbh_yrbs": "Administrator"
        };

        const isValidImage = (link) => {
            if (typeof link !== 'string') return false;
            // Check for common image extensions
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
            try {
                const url = new URL(link, window.location.origin);
                return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
            } catch (e) {
                return false;
            }
        };

        const findMemberByUsername = (username) => {
            if (!username.trim()) {
                error.value = "Please enter a username";
                return;
            }

            const mm = members.value.find(m =>
                m['Discord username']?.toLowerCase() === username.toLowerCase().trim()
            );

            if (mm) {
                member.value = mm;
                error.value = null;
            } else {
                error.value = "Member not found";
                member.value = null;
            }
        };

        loading.value = true;
        error.value = null;
        Papa.parse('members.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV loaded", results.data);
                loading.value = false;
                members.value = results.data;
                if (username) {
                    findMemberByUsername(username);
                    console.log(member.value);
                }
            },
            error: function (error) {
                console.error("CSV load failed", error);
                loading.value = false;
            }
        });

        return {
            member,
            roles,
            isValidImage,
        };
    }
}).mount('#app');