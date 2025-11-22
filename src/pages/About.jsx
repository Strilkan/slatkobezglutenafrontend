import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Gluten-Free Delights</h1>
        <p>Your trusted source for delicious gluten-free recipes</p>
      </div>

      <div className="container">
        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              At Gluten-Free Delights, we believe that eating gluten-free should never mean 
              sacrificing flavor or enjoyment. Our mission is to provide you with delicious, 
              easy-to-follow recipes that prove gluten-free food can be just as tasty and 
              satisfying as traditional recipes.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">📚</div>
                <h3>Diverse Recipe Collection</h3>
                <p>
                  From breakfast to dessert, we cover all meal types with recipes that 
                  are 100% gluten-free and taste amazing.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">✅</div>
                <h3>Tested Recipes</h3>
                <p>
                  Every recipe is carefully tested to ensure it works perfectly and 
                  delivers delicious results every time.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <h3>Clear Instructions</h3>
                <p>
                  Step-by-step instructions with ingredient lists make cooking simple 
                  and stress-free.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">❤️</div>
                <h3>Made with Love</h3>
                <p>
                  We're passionate about creating recipes that bring joy to your table 
                  and support your gluten-free lifestyle.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Understanding Gluten-Free</h2>
            <p>
              A gluten-free diet excludes the protein gluten, which is found in grains such 
              as wheat, barley, and rye. For people with celiac disease or gluten sensitivity, 
              avoiding gluten is essential for their health and well-being.
            </p>
            <p>
              Our recipes use gluten-free flour blends and naturally gluten-free ingredients 
              to create dishes that everyone can enjoy, whether you need to avoid gluten or 
              simply choose to do so.
            </p>
          </section>

          <section className="about-section">
            <h2>Get Cooking!</h2>
            <p>
              Browse our collection of recipes and discover new favorites. Whether you're 
              baking cookies, making bread, or preparing a full meal, we have recipes that 
              will make your gluten-free journey delicious and enjoyable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
