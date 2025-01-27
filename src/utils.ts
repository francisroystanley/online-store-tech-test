const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const generateRating = () => Math.floor(Math.random() * 10) * 0.5 + 0.5;

const generateReviews = () => Math.floor(Math.random() * 100) + 1;

export { formatPrice, generateRating, generateReviews };
