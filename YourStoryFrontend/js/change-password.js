        const token = localStorage.getItem("token");

        async function ChangePassword()
        {
            document.getElementById("notice").innerText = "";
            
            const oldpass = document.getElementById("oldpass").value;
            const newpass = document.getElementById("newpass").value;

            const response = await fetch( `${URL}/User/password?newpass=${newpass}&oldpass=${oldpass}`, 
            {
                method : "PUT",
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });

            if( !response.ok )
            {
                document.getElementById("notice").innerText = "Change password failed";
                return;
            }

            document.getElementById("notice").innerText = "Password changed";
        }