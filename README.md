<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://buggo.vercel.app/">
    <img src="client/public/circle-logo.ico" alt="portfolio-logo" height="80">
  </a>

  <h5 align="center">
    <br />
    <a href="https://buggo.vercel.app/" target="_blank">View Live</a>
    |
    <a href="https://github.com/okoyecharles/buggo/issues/new" target="_blank">Report Bug</a>
    |
    <a href="https://github.com/okoyecharles/buggo/issues/new" target="_blank">Request Feature</a>
  </h5>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#buggo">Buggo</a>
      <ul>
        <li><a href="#live-link">Live Link</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#clone-locally">Clone Locally</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#development">Development</a></li>
        <li><a href="#testing">Testing</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

### Buggo

An issue tracking project that revolutionizes the way you manage and solve problems! Say goodbye to the chaos and confusion of scattered reports and endless follow-up emails. With our issue tracker, you'll have a centralized dashboard where you can effortlessly create, track, and resolve issues.

The perfect solution for anyone looking to streamline their problem-solving process and improve productivity.

<div align="center">
  <img  width="1000" alt="buggo-screenshot" src="./assets/hero-screenshot.webp">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Live link

Experience the magic of **Buggo** for yourself! Join buggo today and discover a world of exciting features and unparalleled convenience at your fingertips. Whether you're looking to learn, connect, or simply explore. [Click here to view it live](https://buggo.vercel.app/).

#### Built With

<details>
  <summary><b>🖥️ Client</b></summary>
  <ul>
    <li>
      <a href="https://nextjs.org/">
        <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://www.typescriptlang.org/">
        <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://tailwindcss.com/">
        <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://redux.js.org/">
        <img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://vercel.app/">
        <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" />
      </a>
    </li>
  </ul>
</details>

<details>
  <summary><b>🔧 Server</b></summary>
  <ul>
    <li>
      <a href="https://nodejs.com/">
        <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://expressjs.com/">
        <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
      </a>
    </li>
    <li>
      <a href="https://mongodb.com/">
        <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />
      </a>
    </li>
  </ul>
</details>

<details>
  <summary><b>✏️ Other</b></summary>
  <ul>
    <li>
      <a href="https://figma.com/">
        <img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white" />
      </a>
    </li>
    <li>
      <a href="https://dribbble.com/">
        <img src="https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white" />
      </a>
    </li>
  </ul>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-----

<!-- GETTING STARTED -->

### Getting Started

#### Clone Locally

- Enter this url: [https://github.com/okoyecharles/buggo](https://github.com/okoyecharles/buggo) in your web browser.
- Once opened navigate to the top left level of the project a green code download button will be visible on the righthand side.
- Select download Zip option from drop down menu.
- Once the download is complete you will be able to access my project locally.

#### Prerequisites

- Node package manager (latest version)
  - Firstly install **node runtime environment (node.js)** then run the code below
  ```sh
  npm install npm@latest -g
  ```
  - Then install yarn **yarn**
  ```sh
  npm install --global yarn
  ```

- Project dependencies
  - Change to the client directory and install all packages with yarn
    from **_../buggo_**
    ```sh
    cd client
    yarn install
    ```
  - Change to the server directory and install all packages with npm
    from **_../buggo/client_**
    ```sh
    cd ..
    cd server
    npm install
    ```

#### Development

- Run the client
  - Change to the client directory and run the code below
    from **_../buggo_**
    ```sh
    cd client
    yarn dev
    ```
- Run the server
  - Change to the server directory and run the code below
    from **_../buggo/client_**
    ```sh
    cd server
    npm run dev
    ```

#### Testing

In order to run tests for this project make sure you followed all steps in the [prerequisites](#prerequisites) section, then run the code below.

- Run all tests
  - This should run all tests in for client
  from **_../buggo_**
    ```sh
    cd client
    npm run test
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-----

<!-- CONTRIBUTING -->

### Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-----

<!-- LICENSE -->

### License

Please be advised that our project is released under the terms of a License. Please ensure that you read and understand the terms of the [MIT](LICENSE) License before using our project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-----

<!-- CONTACT -->

### Contact

#### Okoye Charles

 <div align="center">
 <a href="https://www.linkedin.com/in/charles-k-okoye/"><img src="https://img.shields.io/badge/linkedin-%23f78a38.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin"></a> 
 <a href="https://twitter.com/okoyecharles_"><img src="https://img.shields.io/badge/Twitter-%23f78a38.svg?style=for-the-badge&logo=Twitter&logoColor=white" alt="Twitter"></a> 
 <a href="https://github.com/okoyecharles/"><img src="https://img.shields.io/badge/github-%23f78a38.svg?style=for-the-badge&logo=github&logoColor=white" alt="Github"></a> 
 <a href="https://angel.co/u/charles-k-okoye"><img src="https://img.shields.io/badge/AngelList-%23f78a38.svg?style=for-the-badge&logo=AngelList&logoColor=white" alt="AngelList"></a> 
 <a href="mailto:okoyecharles509@gmail.com"><img src="https://img.shields.io/badge/Gmail-f78a38?style=for-the-badge&logo=gmail&logoColor=white" alt="Linkedin"></a>
 </div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-----

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Discord](https://discord.com/) for the UI design inspiration for this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
