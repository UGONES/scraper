// controllers/contactController.js
export const handleContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Here you could save to DB, send email, etc.
    // For now, just log and respond success
    console.log('Contact form received:', { name, email, message });
    res.status(200).json({ message: 'Thank you for contacting us!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
