document.addEventListener("DOMContentLoaded", function () {
  let container = document.querySelector("#container");
  let userContainer = document.querySelector("#user-container");
  let userInput = document.querySelector("#user-input");
  let searchButton = document.querySelector("#search-btn");
  let statsContainer = document.querySelector("#stats-container");
  let progress = document.querySelector("#progress");
  let progressItem1 = document.querySelector("progress-item1");
  let statsCard = document.querySelector(".stats-card");

  function displayUserData(data) {
    let allContri = 0;
    const all = Object.keys(data.total);
    const totalLength = all.length;
    let progressData = [
      { label: "Github Account age in years", value: totalLength },
      { label: "Total Contributions", value: 0 }, // Placeholder for total contributions
    ];

    for (let i = 0; i < totalLength; i++) {
      console.log(`Contribution in Year ${all[i]}:`, data.total[all[i]]);
      allContri += data.total[all[i]];

      // Add year-wise contributions to progressData
      progressData.push({
        label: `Contributions in Year ${all[i]}`,
        value: data.total[all[i]],
      });
    }

    console.log(`Github account age: ${totalLength}`);
    console.log(`Total Contributions : ${allContri}`);

    // Update total contributions in progressData
    progressData[1].value = allContri;

    console.log(progressData);

    statsContainer.innerHTML = progressData
      .map((data) => {
        return `
            <div class="card">
            <h3>${data.label}</h3>
            <p>${data.value}</p>
            </div>`;
      })
      .join("");
  }

  async function fetchUserDetails(userName) {
    const url = `https://github-contributions-api.jogruber.de/v4/${userName}`;
    try {
      searchButton.textContent = "Searching..";
      searchButton.disabled = true;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Try again!");
      let data = await response.json();
      console.log(data);
      displayUserData(data);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
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

  searchButton.addEventListener("click", () => {
    let userName = userInput.value;
    if (validateUserName(userName)) {
      renderGraphs(userName);
      renderProfile(userName);
    }
  });

  async function renderGraphs(userName) {
    try {
      if (!userName.trim()) throw new Error("Please enter a valid GitHub username.");
      const testUrl = `https://api.github.com/users/${userName}`;
      const response = await fetch(testUrl);
      if (!response.ok) throw new Error("GitHub user not found. Please check the username.");


      statsCard.innerHTML = `<div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="https://github-readme-stats.vercel.app/api?username=${userName}&show_icons=true&theme=default" alt="GitHub Stats" class="mx-auto"> 

</div> <div class="my-8"> <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${userName}&theme=default" alt="GitHub Stats" class="mx-auto"> </div>
 
 <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="http://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${userName}&theme=default" alt="GitHub Stats" class="mx-auto">

  <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="http://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${userName}&theme=default" alt="GitHub Stats" class="mx-auto">

    <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="http://github-profile-summary-cards.vercel.app/api/cards/stats?username=${userName}&theme=default" alt="GitHub Stats" class="mx-auto">

      <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="http://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=${userName}&theme=default&utcOffset=8" alt="GitHub Stats" class="mx-auto">
       
       <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="https://github-profile-trophy.vercel.app/?username=${userName}&theme=default" alt="GitHub Stats" class="mx-auto">
        <div class="my-8"> <h3 class="text-3xl font-bold text-gray-700 mb-4"></h3> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${userName}&layout=compact&theme=default" alt="GitHub Stats" class="mx-auto">`;
    } catch (error) {
      statsCard.innerHTML = `<p>${error.message}</p>`; 
    }
  }
});

async function renderProfile(userName) {
  let Profile = document.querySelector("#profile");
  const url = `https://api.github.com/users/${userName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Profile not found !");
    let data = await response.json();
    let accountCreationDate = new Date(data.created_at); // Convert the ISO date string to a Date object
    let formattedDate = accountCreationDate.toLocaleDateString("en-US", {
      // Format the date
      weekday: "long", // Full weekday name (e.g., "Monday")
      year: "numeric", // Full year (e.g., "2023")
      month: "long", // Full month name (e.g., "August")
      day: "numeric", // Day of the month
    });
    Profile.innerHTML = ` <div class="profile-container">
      <!-- Profile Header -->
      <header class="profile-header">
        <h1>${data.name}</h1>
        <p class="profile-username">@${data.login}</p>
      </header>

      <!-- Profile Details Section -->
      <section class="profile-details">
        <div class="profile-image">
          <img src="${data.avatar_url}" alt="Profile Picture" />
        </div>
        <div class="profile-info">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Bio:</strong> ${data.bio}</p>
 <p><strong>Email:</strong> ${data.email ? data.email : "Email not found"}
</p>    <p><strong>Twitter:</strong> 
  <a href="${
    data.twitter_username
      ? `https://twitter.com/${data.twitter_username}`
      : "https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png"
  }" target="_blank">
    ${data.twitter_username ? data.twitter_username : "Account not found"}
  </a>
</p>
          <p><strong>Website:</strong> <a href="${
            data.blog
          }" target="_blank">Portfolio</a></p>
          <p><strong>Account Creation Date:</strong> ${formattedDate}</p>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="profile-stats">
        <div class="stat-item">
          <strong>Public Repositories:</strong> ${data.public_repos}
        </div>
        <div class="stat-item">
          <strong>Followers:</strong> ${data.followers}
        </div>
        <div class="stat-item">
          <strong>Following:</strong> ${data.following}
        </div>
        <div class="stat-item">
          <strong>Gists:</strong> ${data.public_gists}
        </div>
        <div class="stat-item">
          <strong>Hireable:</strong> ${data.hireable ? "Yes" : "No"}
        </div>`;
  } catch (error) {
    Profile.innerHTML = `<p>${error.message}</p>`; // Show error in the Profile container
  }
}
