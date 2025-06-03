// server/routes/resumeRoutes.js
router.get('/resumes/:userId', resumeController.getUserResumes); 
router.post('/resumes/upload', resumeController.uploadResume);
router.get('/evaluations/:resumeId', resumeController.getEvaluations);
router.get('/jobs/recommended', jobController.getRecommendedJobs); // AI-powered// server/routes/resumeRoutes.js
router.get('/resumes/:userId', resumeController.getUserResumes); 
router.post('/resumes/upload', resumeController.uploadResume);
router.get('/evaluations/:resumeId', resumeController.getEvaluations);
router.get('/jobs/recommended', jobController.getRecommendedJobs); // AI-poweredU