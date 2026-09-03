export const getScoreColor = (score: number) => {
  if (score === 100) return 'text-red-500';      
  if (score > 80 && score < 100) return 'text-green-600'; 
  if (score >= 60 && score <= 80) return 'text-blue-500';  
  return 'text-gray-400'; 
};