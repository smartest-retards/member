const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const members = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const member = ref({});
        const username = new URLSearchParams(window.location.search).get('username');
        console.log(username)

        onMounted(() => {
            loadCSVData();
        });

        const loadCSVData = () => {
            loading.value = true;
            error.value = null;

            Papa.parse('members.csv', { 
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    loading.value = false;
                    if (results.data && results.data.length > 0) {
                        members.value = results.data;
                        findMemberByUsername(username);
                    } else {
                        error.value = "No member data found in the CSV file.";
                    }
                },
                error: function (error) {
                    loading.value = false;
                    error.value = "Failed to load CSV file: " + error.message;
                }
            });
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

        return {
            member
        };
    }
}).mount('#app');