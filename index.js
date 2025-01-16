document.addEventListener("DOMContentLoaded", function () {
  let container = document.querySelector("#container");
  let userContainer = document.querySelector("#user-container");
  let userInput = document.querySelector("#user-input");
  let searchButton = document.querySelector("#search-btn");
  let statsContainer = document.querySelector("#stats-container");
  let progress = document.querySelector("#progress");
  let progressItem1 = document.querySelector("progress-item1");
  let statsCard = document.querySelector("stats-card");




function displayUserData(data) {
    let allContri = 0;
    const all = Object.keys(data.total);
    const totalLength = all.length;
    let progressData = [
      { label: "Github Account age in years", value: totalLength },
      { label: "Total Contributions", value: 0 }  // Placeholder for total contributions
    ];
  
    for (let i = 0; i < totalLength; i++) {
      console.log(`Contribution in Year ${all[i]}:`, data.total[all[i]]);
      allContri += data.total[all[i]];
  
      // Add year-wise contributions to progressData
      progressData.push({
        label: `Contributions in Year ${all[i]}`,
        value: data.total[all[i]]
      });
    }
  
    console.log(`Github account age: ${totalLength}`);
    console.log(`Total Contributions : ${allContri}`);
    
    // Update total contributions in progressData
    progressData[1].value = allContri;
  

  
    console.log(progressData);

    statsContainer.innerHTML= progressData.map(data=>{
        return `
            <div class="card">
            <h3>${data.label}</h3>
            <p>${data.value}</p>
            </div>`
    }).join("")

  }

 

  async function fetchUserDetails(userName) {
    const url = `https://github-contributions-api.jogruber.de/v4/${userName}`;
    try {
        searchButton.textContent='Searching..'
        searchButton.disabled=true
      const response = await fetch(url);
      if(!response.ok) throw new Error("Unable to fetch user details")
      let data = await response.json();
      console.log(data);
      displayUserData(data)
    } catch(error){statsContainer.innerHTML=`<p>${error}</p>`}
    finally{
        
        searchButton.textContent='Search'
        searchButton.disabled=false
    }
  }

  function validateUserName(userName) {
    if (userName.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9-]{1,39}$/;
    const isMatching = regex.test(userName);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  searchButton.addEventListener("click", () => {
    let userName = userInput.value;
    console.log(userName);
    if (validateUserName(userName)) {
      fetchUserDetails(userName);
    }
  });
});
