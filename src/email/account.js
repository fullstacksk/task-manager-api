const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fullstacksk@gmail.com',
        subject: 'Welcome! You have joined us!',
        html: `<p><strong>Thanks for joining in, ${name}</strong></p>
                <blockquote>Fullstacksk welcomes you by heart. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application</blockquote>`
    })
}
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fullstacksk@gmail.com',
        subject: 'Your account was deleted successfully!',
        html: `<p><strong>Thanks for being with in, ${name}</strong></p>
        <blockquote>We have removed your account sucessfully. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application. Let's see whats going inside the application</blockquote>`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}