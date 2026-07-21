import React from "react";
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message: "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image: "https://ui-avatars.com/api/?name=John+Doe&background=6a1b9a&color=fff&size=128",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message: "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image: "https://ui-avatars.com/api/?name=Jane+Smith&background=8a4baf&color=fff&size=128",
      rating: 5,
    },
    {
      id: 3,
      name: "Alice Johnson",
      position: "Student",
      message: "The best learning platform I've ever used. Highly recommend to anyone looking to upskill.",
      image: "https://ui-avatars.com/api/?name=Alice+Johnson&background=f57c00&color=fff&size=128",
      rating: 4,
    },
    {
      id: 4,
      name: "Bob Williams",
      position: "Student",
      message: "Amazing content and great instructors. The community support is also fantastic!",
      image: "https://ui-avatars.com/api/?name=Bob+Williams&background=27ae60&color=fff&size=128",
      rating: 5,
    },
  ];

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? '' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="testimonials">
      <h2>What Our Students Say</h2>
      <p className="subtitle">Real stories from real learners</p>
      
      <div className="testmonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            <div className="quote-icon">“</div>
            
            <div className="student-image">
              <img src={e.image} alt={e.name} />
            </div>
            
            <div className="stars">
              {renderStars(e.rating)}
            </div>
            
            <p className="message">{e.message}</p>
            
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;