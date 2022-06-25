<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/omeround3/veach-remote-db">
    <img src="https://user-images.githubusercontent.com/45568925/175764349-30c0ffc9-99bb-4e78-832a-83288ef4db90.png" alt="Logo" width="250" height="250">
  </a>

<h3 align="center">VEACH Remote DB</h3>

  <p align="center">
    VEACH – Vulnerabilities Exposure and Analysis in Code and Hardware
    <br />
    A remote managed CVE and CPE MongoDB that syncs with NIST NVD Data feeds
    <br />
    <a href="https://github.com/omeround3/veach-remote-db"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/omeround3/veach-remote-db">View Demo</a>
    ·
    <a href="https://github.com/omeround3/veach-remote-db/issues">Report Bug</a>
    ·
    <a href="https://github.com/omeround3/veach-remote-db/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
The VEACH Remote DB project is part of the [VEACH](https://github.com/omeround3/veach) project.

It's a Node.js project that implements a remote managed CVE & CPE databases. The remote database is maintained & updated automatically. Using this remote database, the VEACH system local MongoDB database will be updated periodically from the remote  CVE & CPE database.

[NVD vulnerability data feeds](https://nvd.nist.gov/vuln/data-feeds#JSON_FEED) are published as year-wise JSON files in gzip format. This makes fetching CVE details for particular CVE ID very difficult.

The project integrates with NIST NVD Data feeds to initially import JSON feeds and afterwards syncs the feeds using `meta` feeds dates comparision. By doing so, we are able to keep the database up-to-date with NIST data feeds as suggested [here](https://nvd.nist.gov/vuln/data-feed).

This project also provides queryable REST-API using NodeJS.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With
The following are the frameworks and npm packages used in the project:

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [MongoDB](https://www.mongodb.com/)
* [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
#### Node.js
Make sure you have the Node.js 16 or above installed
[Download Node.js](https://nodejs.org/en/download/0

If you have npm install, check the version with `npm --version`, upgrade npm if needed.
* npm
  ```sh
  npm install npm@latest -g
  ```
#### MongoDB
The remote DB that was used was a MongoDB Atlas managed DB.

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Atlas - Getting Started](https://www.mongodb.com/cloud/atlas/register)

#### AWS Account
We used AWS Elastic Beanstalk to deploy our Node.js app to the cloud.
In order to use this service, you have to create an account in [AWS](https://aws.amazon.com/) first.

1. Set up `aws cli` in your environment - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
2. Set up `eb cli` in your environment - https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/omeround3/veach-remote-db.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file in the root folder and MongoDB credentails and hostname. And Node app port and log level.
   ```
   DB_USERNAME="username"
   DB_PASSWORD="password"
   DB_HOST="hostname"
   PORT="3000"
   LOG_LEVEL="debug"
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
To run this project simply run: `npm start`
Logging is set to `stdout` by default, but it can be changed if needed by modifying the winston logger settings that can be found in: `veach-remote-db/app/services/logger.js`

### Get CVE example
```
GET http://localhost:3000/cvedetails/CVE-2017-0001
    {
    	"_id": "CVE-2017-0001",
    	"cve": {
    		"data_type": "CVE",
    		"data_format": "MITRE",
    		"data_version": "4.0",
    		"CVE_data_meta": {
    			"ID": "CVE-2017-0001",
    			"ASSIGNER": "cve@mitre.org"
    		},
    		"description": {
    			"description_data": [{
    				"lang": "en",
    				"value": "The Graphics Device Interface (GDI) in Microsoft Windows Vista SP2; Windows Server 2008 SP2 and R2 SP1; Windows 7 SP1; Windows 8.1; Windows Server 2012 Gold and R2; Windows RT 8.1; and Windows 10 Gold, 1511, and 1607 allows local users to gain privileges via a crafted application, aka \"Windows GDI Elevation of Privilege Vulnerability.\" This vulnerability is different from those described in CVE-2017-0005, CVE-2017-0025, and CVE-2017-0047."
    			}]
    		}
    	},
    	"impact": {
    		"baseMetricV3": {
    			"cvssV3": {
    				"version": "3.0",
    				"vectorString": "CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
    				"attackVector": "LOCAL",
    				"attackComplexity": "LOW",
    				"privilegesRequired": "LOW",
    				"userInteraction": "NONE",
    				"scope": "UNCHANGED",
    				"confidentialityImpact": "HIGH",
    				"integrityImpact": "HIGH",
    				"availabilityImpact": "HIGH",
    				"baseScore": 7.8,
    				"baseSeverity": "HIGH"
    			},
    			"exploitabilityScore": 1.8,
    			"impactScore": 5.9
    		},
    		"baseMetricV2": {
    			"cvssV2": {
    				"version": "2.0",
    				"vectorString": "AV:L/AC:L/Au:N/C:C/I:C/A:C",
    				"accessVector": "LOCAL",
    				"accessComplexity": "LOW",
    				"authentication": "NONE",
    				"confidentialityImpact": "COMPLETE",
    				"integrityImpact": "COMPLETE",
    				"availabilityImpact": "COMPLETE",
    				"baseScore": 7.2
    			},
    			"severity": "HIGH",
    			"exploitabilityScore": 3.9,
    			"impactScore": 10,
    			"obtainAllPrivilege": false,
    			"obtainUserPrivilege": false,
    			"obtainOtherPrivilege": false,
    			"userInteractionRequired": false
    		}
    	},
    	"publishedDate": "2017-03-17T00:59Z",
    	"lastModifiedDate": "2019-10-03T00:03Z"
    }
```
### Deploy to AWS Elastic Beanstalk
To deploy to AWS Elastic Beanstalk, we are recommending to follow AWS official documentation.
They are covering all the steps needed to deploy the Node.js application to Elastic Beanstalk.

[Link to Docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html)
[Another good guide](https://medium.com/@xoor/deploying-a-node-js-app-to-aws-elastic-beanstalk-681fa88bac53)

Make sure to create a user with specific permissions to Elastic Beansstalk and not to use the root AWS user for the deployment (basic security measures).

For reference, here are the configurations we used for environment creation and deployment:
1. Create a folder under the root project folder name `.elasticbeanstalk`.
2. Create a file named `config.yml` in `veach-remote-db/.elasticbeanstalk` folder with the following content:
```
branch-defaults:
  dev:
    environment: veach-remote-db-dev
global:
  application_name: veach-remote-db
  branch: null
  default_ec2_keyname: veach-key
  default_platform: Node.js 16 running on 64bit Amazon Linux 2
  default_region: eu-central-1
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: eb-deploy-user
  repository: null
  sc: git
  workspace_type: Application
```
- Change the profile for the [AWS CLI profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) you want.
- Change the `default_region` if needed.
- Change the branch used and any other parameters needed.

3. Create a folder under the root project folder name `.ebextensions`.
4. Create a file named `01nodecommand.config` in `veach-remote-db/.ebextensions` folder with the following content:
```
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```
6. Create a file named `02log-streaming.config` in `veach-remote-db/.ebextensions` folder with the following content:
```
option_settings:
  aws:elasticbeanstalk:cloudwatch:logs:
    StreamLogs: true
    DeleteOnTerminate: false
    RetentionInDays: 7
```
5. Run the command `eb create` and then `eb deploy` (you need aws cli and eb configured in your environment)
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Add GUI for log monitoring
- [ ] Add basic user authentication
- [ ] Improve code documentation

See the [open issues](https://github.com/omeround3/veach-remote-db/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

- omeround3@gmail.com
- danielshaal92@gmail.com
- thagag16@gmail.com

Project Link: [https://github.com/omeround3/veach-remote-db](https://github.com/omeround3/veach-remote-db)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Project inspired by [nvd-cvedetails-api](https://github.com/TheNilesh/nvd-cvedetails-api)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/omeround3/veach-remote-db.svg?style=for-the-badge
[contributors-url]: https://github.com/omeround3/veach-remote-db/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/omeround3/veach-remote-db.svg?style=for-the-badge
[forks-url]: https://github.com/omeround3/veach-remote-db/network/members
[stars-shield]: https://img.shields.io/github/stars/omeround3/veach-remote-db.svg?style=for-the-badge
[stars-url]: https://github.com/omeround3/veach-remote-db/stargazers
[issues-shield]: https://img.shields.io/github/issues/omeround3/veach-remote-db.svg?style=for-the-badge
[issues-url]: https://github.com/omeround3/veach-remote-db/issues
[license-shield]: https://img.shields.io/github/license/omeround3/veach-remote-db.svg?style=for-the-badge
[license-url]: https://github.com/omeround3/veach-remote-db/blob/master/LICENSE.md
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/omer-lev-ron-a075351b0
