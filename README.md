# INSTALLATION 
- Download Node js runtime from [NodeJs](https://nodejs.org/en/download) and follow installation process.
- Verify installation by typing ```node -v ``` in command prompt.
- Verify if npm is installed by running ```npm -v``` in command prompt.
- Download the repo as zip file from github as [AI Allocation System](https://github.com/VictrenDev/AI-Student-Hostel-Allocation-System) i.e. on github, click on ```code``` and ```download zip```
- Once it's done downloading, extract the file to the folder of preference and open the folder with VS Code.
- Create a ```.env``` file in the root of the folder and paste in the environment variables.
- Open terminal in VS Code and run ```npm install``` to install all the dependencies.
- Once it's done, run these codes one after the job, ```npm drizzle-kit generate``` then ```npm drizzle-kit migrate```
- Once everything is installed, run ```npm run dev```. You should be up and running after these.


# AI Student Hostel Allocation System

## Overview
The **AI Student Hostel Allocation System** is an intelligent software solution that automates the allocation of hostel accommodations for students. It uses AI-driven decision logic to ensure fair, efficient, and transparent room assignments while reducing manual administrative effort.

---

## Problem Statement
Traditional hostel allocation processes are often manual and inefficient, leading to:
- Time-consuming administrative work  
- Human bias and allocation conflicts  
- Poor utilization of hostel capacity  
- Difficulty managing large numbers of applicants  
- Limited transparency for students  

---

## Solution
This system replaces manual allocation with an AI-based approach that:
- Collects student data and preferences  
- Applies prioritization rules and intelligent scoring  
- Allocates rooms based on availability and constraints  
- Provides clear allocation results to students and administrators  

---

## Features
- Automated hostel room allocation  
- AI-based prioritization logic  
- Student application and preference submission  
- Admin management of hostels and rooms  
- Allocation status tracking  
- Scalable system design  

---

## System Workflow
1. Students submit hostel applications  
2. Student data is validated and processed  
3. AI logic evaluates priorities and preferences  
4. Hostel rooms are allocated automatically  
5. Allocation results are displayed to users  

---

## Technologies Used
> Update as per your implementation

- **Backend:** Python / Flask / Django / Node.js  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** MySQL / PostgreSQL / SQLite  
- **AI Logic:** Rule-based system / Optimization / ML scoring  

---

## Installation
```bash
git clone https://github.com/your-username/ai-student-hostel-allocation-system.git
cd ai-student-hostel-allocation-system
pip install -r requirements.txt
python app.py
