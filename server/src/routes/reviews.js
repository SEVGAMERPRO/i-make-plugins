const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const store = require('../store/globalStore');

// @route   GET /api/reviews/platform
// @desc    Get website platform reviews
router.get('/platform', (req, res) => {
  try {
    const data = store.getWebsiteReviews();
    res.json({ success: true, ...data });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to get platform reviews' });
  }
});

// @route   POST /api/reviews/platform
// @desc    Submit website platform review
router.post('/platform', auth, (req, res) => {
  try {
    const { rating, title, comment, message } = req.body;
    const rawRating = parseFloat(rating);
    if (isNaN(rawRating) || rawRating < 1.0 || rawRating > 5.0) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1.0 and 5.0' });
    }
    const text = (comment || message || '').trim();
    if (!text) {
      return res.status(400).json({ success: false, message: 'Review message is required' });
    }
    const targetUser = store.getUsers().find(u => u.id === req.user.id || (req.user.email && u.email && u.email.toLowerCase() === req.user.email.toLowerCase()));
    const newRev = store.addWebsiteReview({
      userId: req.user.id,
      username: req.user.username || (targetUser ? targetUser.username : req.user.email?.split('@')[0] || 'Community Member'),
      avatarUrl: targetUser?.avatarUrl || req.user.avatarUrl || '/images/avatars/default.png',
      rating: rawRating,
      title: title || 'MinoForge Experience',
      comment: text,
      isUltimate: Boolean(targetUser?.isUltimate || req.user.isUltimate)
    });
    res.status(201).json({ success: true, message: 'Thank you for your review!', review: newRev });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// @route   GET /api/reviews/plugin/:pluginId
// @desc    Get reviews for a plugin
router.get('/plugin/:pluginId', optionalAuth, (req, res) => {
  try {
    const data = store.getPluginReviews(req.params.pluginId);
    let canReview = false;
    if (req.user) {
      canReview = store.hasPurchased(req.user.id, req.user.email, req.params.pluginId);
    }
    res.json({ success: true, ...data, canReview, purchaseVerified: canReview });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch plugin reviews' });
  }
});

// @route   POST /api/reviews/plugin/:pluginId
// @desc    Submit verified review for a plugin seller
router.post('/plugin/:pluginId', auth, (req, res) => {
  try {
    const { rating, title, comment, message } = req.body;
    const rawRating = parseFloat(rating);
    if (isNaN(rawRating) || rawRating < 1.0 || rawRating > 5.0) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1.0 and 5.0' });
    }
    const text = (comment || message || '').trim();
    if (!text) {
      return res.status(400).json({ success: false, message: 'Review message is required' });
    }
    const isEligible = store.hasPurchased(req.user.id, req.user.email, req.params.pluginId);
    if (!isEligible) {
      return res.status(403).json({ success: false, message: '🔒 Verified purchase required. You must purchase or download this resource before submitting a review for the seller.' });
    }
    const targetUser = store.getUsers().find(u => u.id === req.user.id || (req.user.email && u.email && u.email.toLowerCase() === req.user.email.toLowerCase()));
    const result = store.addPluginReview(req.params.pluginId, {
      userId: req.user.id,
      username: req.user.username || (targetUser ? targetUser.username : req.user.email?.split('@')[0] || 'Verified Buyer'),
      avatarUrl: targetUser?.avatarUrl || req.user.avatarUrl || '/images/avatars/default.png',
      rating: rawRating,
      title: title || 'Resource Review',
      comment: text,
      isUltimate: Boolean(targetUser?.isUltimate || req.user.isUltimate)
    });
    res.status(201).json({ success: true, message: 'Your review has been verified and published!', ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to publish review' });
  }
});

module.exports = router;
