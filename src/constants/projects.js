export const projects = [
  {
    id: 1,
    title: 'Medha AI',
    description:
      'An AI-powered conversational assistant built with modern web technologies. Medha AI focuses on intelligent conversations, natural language interaction, and providing a smooth AI experience.',
    images: ['medha-ai.png', 'medha-ai2.png'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'LLM API'],
    github: 'https://github.com/code-withrafi/Medha-AI',
    live: 'https://medha-ai-ochre.vercel.app/',
    featured: true,
  },

  {
    id: 2,
    title: 'SkyCast',
    description:
      'A modern weather forecasting application providing real-time weather information, hourly forecasts, weekly forecasts, location search, favorites, and beautiful weather animations.',
    images: ['skycast.png', 'skycast2.png', 'skycast3.png', 'skycast4.png'],
    technologies: ['React', 'TypeScript', 'Redux Toolkit', 'React Query', 'Tailwind CSS'],
    github: 'https://github.com/code-withrafi/SkyCast-Weather',
    live: 'https://skycastweather-ochre.vercel.app/',
    featured: true,
  },

  {
    id: 3,
    title: 'EmotionVision',
    description:
      'An AI-based computer vision project designed to analyze human emotions using deep learning and facial expression recognition techniques.',
    images: ['emotionvision.png', 'emotionvision2.png', 'emotionvision3.png'],
    technologies: ['Python', 'OpenCV', 'Deep Learning', 'Computer Vision'],
    github: 'https://github.com/code-withrafi/EmotionVision',
    live: '',
    featured: true,
  },

  {
    id: 4,
    title: 'Portfolio',
    description:
      'A premium interactive developer portfolio showcasing my projects, skills, experience, and journey as a software engineering student.',
    images: ['portfolio.png', 'portfolio2.png', 'portfolio3.png'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
    github: 'https://github.com/code-withrafi/portfolio',
    live: '',
    featured: true,
  },

  {
    id: 5,
    title: 'Automatic Number Plate Recognition',
    description:
      'An end-to-end Automatic Number Plate Recognition (ANPR) system that detects vehicles and license plates, recognizes plate numbers using OCR, stores detection records, and provides a web dashboard for monitoring, searching, and analyzing results.',
    images: ['anpr.png', 'anpr2.png', 'anpr3.png', 'anpr4.png'],
    technologies: ['Python', 'FastAPI', 'YOLO', 'OpenCV', 'EasyOCR', 'PyTorch', 'MongoDB Atlas'],
    github: 'https://github.com/code-withrafi/ANPR',
    live: '',
    featured: true,
  },

  {
    id: 6,
    title: 'Disease Prediction from Medical Data',
    description:
      'Machine learning project for predicting heart disease from clinical data,using the UCI Heart Disease dataset.. It compares three classifiers and applies threshold optimization to prioritize reducing false negatives.',
    images: [
      'disease_prediction_model_comparison.png',
      'disease_prediction_threshold_analysis.png',
    ],
    technologies: ['Python'],
    github: 'https://github.com/code-withrafi/disease-prediction',
    live: '',
    featured: true,
  },

  {
    id: 7,
    title: 'Handwritten Character Recognition',
    description:
      'A machine learning project for recognizing handwritten digits from the MNIST dataset using Logistic Regression and Convolutional Neural Networks (CNNs).This project compares a traditional machine learning baseline with CNN architectures and evaluates accuracy, training behavior, classification errors, and inference speed.',
    images: ['handwriting_loss_curve.png', 'handwriting_accuracy_curve.png'],
    technologies: ['Python'],
    github: 'https://github.com/code-withrafi/handwritten-character-recognition',
    live: '',
    featured: true,
  },

  {
    id: 8,
    title: 'Language Model Evaluation Harness',
    description:
      'A Python-based evaluation framework for testing prompt behavior, scoring model responses, comparing prompt versions, and detecting regressions.',
    images: ['category_pass_rates.png'],
    technologies: ['Python'],
    github: 'https://github.com/code-withrafi/language-model-eval-harness',
    live: '',
    featured: true,
  },
  {
    id: 9,
    title: 'Airline Management System',
    description:
      'A hybrid airline management system | PySide6 desktop for admin/staff, React web for passengers, FastAPI backend, PostgreSQL database.',
    images: [
      'landing.png',
      'Flightresult.png',
      '3flightdetails.png',
      '4seatselection.png',
      '5mockpayment.png',
      '6confirmation.png',
      '7bookingdetails.png',
    ],
    technologies: [
      'Python',
      'PySide6',
      'React',
      'Framer Motion',
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'ReportLab',
    ],
    github: 'https://github.com/code-withrafi/airline-management-system',
    live: '',
    featured: true,
  },
];
