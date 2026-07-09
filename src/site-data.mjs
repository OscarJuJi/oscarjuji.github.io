/**
 * Single source of truth for the site's content.
 *
 * The React components (About, Education, ProfessionalExperience, App) render
 * from this data, and the AI chatbot (ai-brain.mjs) builds its answer context
 * from the SAME data — so the page and the bot can never disagree.
 *
 * Kept free of React/JSX so Node test scripts can import it directly.
 */

export const profile = {
  name: "Oscar Antonio Juarez",
  fullName: "Oscar Antonio Juarez Jimenez",
  title: "Full Stack Developer & Artificial Intelligence Engineer",
  location: "Mexico City, Mexico",
  email: "oscar.a.juarez.j@gmail.com",
  gitHub: "OscarJuJi",
  linkedIn: "oscar-juji",
  website: "oscarjuji.github.io",
};

export const aboutDescription =
  "I am an Artificial Intelligence Engineer who approaches problems from both ends of the pipeline: building the data engineering foundations that make intelligent systems possible, and designing the machine learning models that run on top of them. I have hands-on experience across data engineering, machine learning, and applied AI, with a particular interest in computer vision, natural language processing, and generative AI. What drives me is turning ambitious, research-grade ideas into dependable systems that create real value.";

export const aboutQuote =
  "I believe great AI engineering is equal parts discipline and creativity. So if it can be imagined, it can be built — and I want to be the one to build it.";

export const aboutStats = [
  { number: "+20", label: "Tools & Technologies", icon: "graduation" },
  { number: "+2", label: "Years of Experience", icon: "briefcase" },
  { number: "10+", label: "Certifications", icon: "trophy" },
  { number: "20+", label: "Projects Built", icon: "rocket" },
];

export const skillsList = [
  // AI / ML
  { name: "Artificial Intelligence", icon: "https://img.icons8.com/color/100/artificial-intelligence.png" },
  { name: "Machine Learning", icon: "https://img.icons8.com/?size=100&id=oOOSYZyuA844&format=png&color=000000" },
  { name: "Deep Learning", icon: "https://img.icons8.com/?size=100&id=jH4BpkMnRrU5&format=png&color=000000" },
  { name: "NLP", icon: "https://img.icons8.com/?size=100&id=sop9ROXku5bb&format=png&color=000000" },
  { name: "Computer Vision", icon: "https://img.icons8.com/?size=100&id=bpip0gGiBLT1&format=png&color=000000" },
  { name: "Data Science", icon: "https://img.icons8.com/?size=100&id=xSkewUSqtErH&format=png&color=000000" },
  { name: "PyTorch", icon: "https://img.icons8.com/?size=100&id=jH4BpkMnRrU5&format=png&color=000000" },
  { name: "OpenAI API", icon: "https://img.icons8.com/?size=100&id=ka3InxFU3QZa&format=png&color=000000" },
  // Cloud & Infra
  { name: "Google Cloud", icon: "https://img.icons8.com/color/100/google-cloud.png" },
  { name: "Azure ML", icon: "https://img.icons8.com/color/100/azure-1.png" },
  { name: "AWS", icon: "https://img.icons8.com/color/100/amazon-web-services.png" },
  { name: "Docker", icon: "https://img.icons8.com/color/100/docker.png" },
  { name: "Kubernetes", icon: "https://img.icons8.com/color/100/kubernetes.png" },
  { name: "MLflow", icon: "https://img.icons8.com/?size=100&id=33039&format=png&color=000000" },
  // Backend / Frameworks
  { name: "Python", icon: "https://img.icons8.com/color/100/python.png" },
  { name: "FastAPI", icon: "https://img.icons8.com/?size=100&id=21888&format=png&color=000000" },
  { name: "Django", icon: "https://img.icons8.com/color/100/django.png" },
  { name: "Java", icon: "https://img.icons8.com/color/100/java-coffee-cup-logo--v1.png" },
  { name: "C++", icon: "https://img.icons8.com/color/100/c-plus-plus-logo.png" },
  { name: "C#", icon: "https://img.icons8.com/color/100/c-sharp-logo.png" },
  // Frontend
  { name: "React", icon: "https://img.icons8.com/color/100/react-native.png" },
  { name: "Node.js", icon: "https://img.icons8.com/color/100/nodejs.png" },
  { name: "TypeScript", icon: "https://img.icons8.com/color/100/typescript.png" },
  { name: "HTML/CSS/JS", icon: "https://img.icons8.com/color/100/html-5--v1.png" },
  // Data & Analytics
  { name: "Oracle SQL", icon: "https://img.icons8.com/color/100/oracle-logo.png" },
  { name: "Power BI", icon: "https://img.icons8.com/color/100/power-bi.png" },
  { name: "Tableau", icon: "https://img.icons8.com/color/100/tableau-software.png" },
  // Tools
  { name: "Git", icon: "https://img.icons8.com/color/100/git.png" },
  { name: "GitHub", icon: "https://img.icons8.com/fluency/100/github.png" },
  { name: "REST APIs", icon: "https://img.icons8.com/color/100/api.png" },
  { name: "MATLAB", icon: "https://img.icons8.com/?size=100&id=r5Y16PcDkoWI&format=png&color=000000" },
  { name: "Visual Studio", icon: "https://img.icons8.com/?size=100&id=ezj3zaVtImPg&format=png&color=000000" },
];

export const educationList = [
  {
    date: "Aug 2021 – Jul 2025",
    title: "B.Sc. Artificial Intelligence Engineering · GPA 9.5 / 10",
    institution: "Escuela Superior de Cómputo (ESCOM) · IPN — Mexico City",
    description:
      "Focused on machine learning, deep learning, computer vision, NLP, bio-inspired algorithms, and software engineering for intelligent systems. Relevant coursework: Machine Learning, Digital Image Processing, Natural Language Technologies, Neural Networks & Deep Learning, Advanced Neural Networks, Software Engineering for Intelligent Systems, Parallel Computing, Bio-Inspired Algorithms.",
  },
  {
    date: "2024 – Present",
    title: "AWS Certified Data Engineer – Associate (In Progress)",
    institution: "Amazon Web Services",
    description:
      "Preparing for the AWS Data Engineer – Associate certification, covering data pipelines, storage, processing, and security on AWS infrastructure.",
  },
  {
    date: "2025",
    title: "SAFe Scrum Master · AWS Technical Essentials · Jira Scrum Team",
    institution: "Scaled Agile · Amazon Web Services · Atlassian",
    description:
      "Completed agile project management training (SAFe Scrum Master), foundational AWS cloud services (AWS Technical Essentials), and Jira workflow configuration for Scrum teams.",
  },
  {
    date: "2024",
    title: "Secure Development 3.0 · FreeCodeCamp Certifications",
    institution: "Net4skills · FreeCodeCamp",
    description:
      "Secure software development practices (Net4skills). FreeCodeCamp certifications in Legacy Responsive Web Design, Legacy Python for Everybody, and JavaScript Algorithms & Data Structures.",
  },
  {
    date: "2023",
    title: "Google Cloud Computing Foundations · GenAI Skill Badge Pathways",
    institution: "Google Cloud",
    description:
      "Earned the Google Cloud Computing Foundations Certificate and the Beginner: Introduction to Generative AI Learning Path, covering cloud architecture, GCP services, neural networks, NLP, and image generation.",
  },
  {
    date: "2023",
    title: "Microsoft Learn AI Skills Challenge (Azure)",
    institution: "Microsoft",
    description:
      "Obtained insights into Azure cloud services with a focus on Machine Learning, Cognitive Services, and the lifecycle of AI models.",
  },
  {
    date: "2022",
    title: "Oracle Next Education",
    institution: "Oracle · Alura LATAM",
    description:
      "Acquired skills in programming logic, front-end and back-end development, and entrepreneurship through Oracle's sponsored training program.",
  },
];

export const experienceList = [
  {
    date: "Jul 2025 – Present",
    title: "Data Engineer",
    company: "Bluetab (an IBM Company) · BBVA",
    bullets: [
      "Implement ETL pipelines — ingestion, transformation, and storage — integrating multiple data sources into the bank's core data infrastructure.",
      "Manage datasets and tables in AWS S3, ensuring structured storage and efficient access for Spark-based processing and advanced analytics.",
      "Maintain and optimize data pipelines in distributed cluster environments, guaranteeing reliability, quality, and high availability.",
      "Collaborate on data integration strategies for analytical use cases and ML models within the structural risk division.",
    ],
  },
  {
    date: "Feb – Jul 2025",
    title: "Innovation & Development Intern",
    company: "Grupo Salinas",
    bullets: [
      "Researched, developed, and deployed AI tools to optimize business workflows and validate models in innovation-driven environments.",
      "Engineered AI agents, conversational chatbots, visual prototypes, and dynamic landing pages for internal business units.",
    ],
  },
  {
    date: "Jun – Dec 2024",
    title: "Full-Stack Intern",
    company: "Banco de México",
    bullets: [
      "Boosted system performance by 30% by optimizing SQL queries and reducing algorithmic complexity in Java and JavaScript.",
      "Streamlined an internal tool's UX through a more intuitive and responsive interface redesign.",
      "Enforced database integrity and security via normalization, stored procedures, views, indexing, and role-based access control in Oracle SQL.",
    ],
  },
];
