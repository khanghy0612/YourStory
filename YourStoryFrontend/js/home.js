    const token = CheckLogin();
    const username = localStorage.getItem("username");

    document.getElementById("hello").innerText=`Hi ${username}, hôm nay sao rùi !`;