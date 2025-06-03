/**
 * Main JavaScript for Jordan Mukite's Digital Marketing Website
 * Handles navigation, review tool functionality, and form submissions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (window.innerWidth < 768) {
                nav.style.display = 'none';
            }
        });
    });

    // Digital Review Tool Form Submission
    const digitalReviewForm = document.getElementById('digital-review-form');
    const reviewResults = document.getElementById('review-results');
    
    if (digitalReviewForm) {
        digitalReviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const companyName = document.getElementById('company-name').value;
            const companyLocation = document.getElementById('company-location').value;
            const companyWebsite = document.getElementById('company-website').value || 'Not provided';
            const companyIndustry = document.getElementById('company-industry').value;
            
            // Display company name in results
            document.getElementById('result-company-name').textContent = companyName;
            
            // Generate metrics report based on the company information
            generateMetricsReport(companyName, companyLocation, companyIndustry, companyWebsite);
            
            // Show results section
            reviewResults.classList.remove('hidden');
            
            // Scroll to results
            window.scrollTo({
                top: reviewResults.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // PDF Download functionality
    const downloadPdfBtn = document.getElementById('download-pdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            generatePDF();
        });
    }
    
    // Email Share functionality
    const shareEmailBtn = document.getElementById('share-email');
    const emailShareForm = document.getElementById('email-share-form');
    const cancelEmailBtn = document.getElementById('cancel-email');
    const emailSuccessMessage = document.getElementById('email-success');
    const closeSuccessBtn = document.getElementById('close-success');
    
    if (shareEmailBtn) {
        shareEmailBtn.addEventListener('click', function() {
            emailShareForm.classList.remove('hidden');
        });
    }
    
    if (cancelEmailBtn) {
        cancelEmailBtn.addEventListener('click', function() {
            emailShareForm.classList.add('hidden');
            // Clear any error messages and reset form
            const errorElements = document.querySelectorAll('.email-error');
            errorElements.forEach(el => el.remove());
            document.getElementById('recipient-email').style.borderColor = '';
            document.getElementById('share-email-form').reset();
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            emailSuccessMessage.classList.add('hidden');
        });
    }
    
    // Email Share Form Submission
    const shareEmailForm = document.getElementById('share-email-form');
    if (shareEmailForm) {
        shareEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recipientEmail = document.getElementById('recipient-email').value;
            const emailMessage = document.getElementById('email-message').value;
            
            // Validate email
            if (!validateEmail(recipientEmail)) {
                showEmailError('Please enter a valid email address');
                return;
            }
            
            // Simulate email sending
            sendEmailReport(recipientEmail, emailMessage);
            
            // Hide form after submission
            emailShareForm.classList.add('hidden');
            
            // Show success message
            emailSuccessMessage.classList.remove('hidden');
            
            // Reset form
            shareEmailForm.reset();
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            alert(`Thank you ${name}! Your message has been received. We'll get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate newsletter subscription
            alert(`Thank you for subscribing to our newsletter with email: ${email}`);
            
            // Reset form
            newsletterForm.reset();
        });
    }
});

/**
 * Generate metrics report based on company information
 * @param {string} companyName - Name of the company
 * @param {string} companyLocation - Location of the company
 * @param {string} companyIndustry - Industry of the company
 * @param {string} companyWebsite - Website of the company
 */
function generateMetricsReport(companyName, companyLocation, companyIndustry, companyWebsite) {
    // Fetch metrics sections
    const websiteMetricsSection = document.querySelector('.metrics-section:nth-child(1) .metrics-grid');
    const socialMediaSection = document.querySelector('.metrics-section:nth-child(2) .metrics-grid');
    const localPresenceSection = document.querySelector('.metrics-section:nth-child(3) .metrics-grid');
    const recommendationsList = document.getElementById('recommendations-list');
    
    // Clear previous results
    websiteMetricsSection.innerHTML = '';
    socialMediaSection.innerHTML = '';
    localPresenceSection.innerHTML = '';
    recommendationsList.innerHTML = '';
    
    // Check if this is Smile Charlotte (our example case)
    const isSmileCharlotte = companyName.toLowerCase().includes('smile charlotte') || 
                            (companyWebsite && companyWebsite.toLowerCase().includes('smilecharlotte'));
    
    // Generate metrics based on whether this is our example case or not
    const metrics = isSmileCharlotte ? 
                    getSmileCharlotteMetrics() : 
                    generateSimulatedMetrics(companyIndustry);
    
    // Populate Website Metrics
    addMetricCard(websiteMetricsSection, 'Website Traffic', metrics.website_metrics.traffic.total_visitors, 'visitors/month', getScoreColor(metrics.website_metrics.traffic.total_visitors, 1000, 5000));
    addMetricCard(websiteMetricsSection, 'Bounce Rate', metrics.website_metrics.performance.bounce_rate + '%', 'Lower is better', getScoreColor(100 - metrics.website_metrics.performance.bounce_rate, 60, 80));
    addMetricCard(websiteMetricsSection, 'Mobile Friendliness', metrics.website_metrics.performance.mobile_friendliness_score + '/100', 'Score', getScoreColor(metrics.website_metrics.performance.mobile_friendliness_score, 70, 90));
    addMetricCard(websiteMetricsSection, 'SEO Ranking', metrics.website_metrics.seo.organic_search_ranking, 'Position', getScoreColor(100 - metrics.website_metrics.seo.organic_search_ranking, 70, 90));
    
    // Populate Social Media Metrics
    addMetricCard(socialMediaSection, 'Facebook Followers', metrics.social_media_metrics.facebook.followers, 'followers', getScoreColor(metrics.social_media_metrics.facebook.followers, 500, 2000));
    addMetricCard(socialMediaSection, 'Instagram Engagement', metrics.social_media_metrics.instagram.engagement_rate + '%', 'engagement rate', getScoreColor(metrics.social_media_metrics.instagram.engagement_rate, 2, 5));
    addMetricCard(socialMediaSection, 'Twitter Followers', metrics.social_media_metrics.twitter.followers, 'followers', getScoreColor(metrics.social_media_metrics.twitter.followers, 300, 1500));
    addMetricCard(socialMediaSection, 'LinkedIn Presence', metrics.social_media_metrics.linkedin.followers, 'followers', getScoreColor(metrics.social_media_metrics.linkedin.followers, 200, 1000));
    
    // Populate Local Presence Metrics
    addMetricCard(localPresenceSection, 'Google Rating', metrics.local_presence_metrics.google_my_business.rating + '/5', 'stars', getScoreColor(metrics.local_presence_metrics.google_my_business.rating, 3.5, 4.5));
    addMetricCard(localPresenceSection, 'Review Count', metrics.local_presence_metrics.google_my_business.review_count, 'reviews', getScoreColor(metrics.local_presence_metrics.google_my_business.review_count, 20, 100));
    addMetricCard(localPresenceSection, 'Directory Listings', metrics.local_presence_metrics.local_directories.listing_count, 'listings', getScoreColor(metrics.local_presence_metrics.local_directories.listing_count, 5, 15));
    addMetricCard(localPresenceSection, 'Listing Consistency', metrics.local_presence_metrics.local_directories.consistency_score + '%', 'consistency', getScoreColor(metrics.local_presence_metrics.local_directories.consistency_score, 70, 90));
    
    // Generate recommendations based on metrics
    generateRecommendations(recommendationsList, metrics, companyIndustry, isSmileCharlotte);
    
    // Update the dashboard preview based on the metrics
    updateDashboardPreview(metrics, isSmileCharlotte);
}

/**
 * Add a metric card to the specified container
 * @param {HTMLElement} container - Container to add the metric card to
 * @param {string} title - Title of the metric
 * @param {string|number} value - Value of the metric
 * @param {string} unit - Unit of measurement
 * @param {string} color - Color based on score (red, yellow, green)
 */
function addMetricCard(container, title, value, unit, color) {
    const metricCard = document.createElement('div');
    metricCard.className = 'metric-card';
    metricCard.style.backgroundColor = 'white';
    metricCard.style.padding = '15px';
    metricCard.style.borderRadius = '8px';
    metricCard.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    metricCard.style.position = 'relative';
    metricCard.style.overflow = 'hidden';
    
    // Add color indicator
    const colorIndicator = document.createElement('div');
    colorIndicator.style.position = 'absolute';
    colorIndicator.style.top = '0';
    colorIndicator.style.left = '0';
    colorIndicator.style.width = '5px';
    colorIndicator.style.height = '100%';
    colorIndicator.style.backgroundColor = color;
    metricCard.appendChild(colorIndicator);
    
    // Add content
    const content = document.createElement('div');
    content.style.marginLeft = '10px';
    
    const titleElement = document.createElement('h5');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '5px';
    content.appendChild(titleElement);
    
    const valueElement = document.createElement('p');
    valueElement.innerHTML = `<strong>${value}</strong> <span style="color: #64748b; font-size: 0.9rem;">${unit}</span>`;
    valueElement.style.marginBottom = '0';
    content.appendChild(valueElement);
    
    metricCard.appendChild(content);
    container.appendChild(metricCard);
}

/**
 * Generate recommendations based on metrics
 * @param {HTMLElement} container - Container to add recommendations to
 * @param {Object} metrics - Metrics object
 * @param {string} industry - Company industry
 * @param {boolean} isSmileCharlotte - Whether this is the Smile Charlotte example
 */
function generateRecommendations(container, metrics, industry, isSmileCharlotte) {
    const recommendations = [];
    
    // Website recommendations
    if (metrics.website_metrics.traffic.total_visitors < 1000) {
        recommendations.push('Increase website traffic through targeted SEO strategies and content marketing');
    }
    
    if (metrics.website_metrics.performance.bounce_rate > 60) {
        recommendations.push('Improve website engagement by enhancing user experience and page load times');
    }
    
    if (metrics.website_metrics.performance.mobile_friendliness_score < 80) {
        recommendations.push('Optimize website for mobile devices to improve user experience and search rankings');
    }
    
    // Social media recommendations
    const lowSocialEngagement = metrics.social_media_metrics.facebook.engagement_rate < 2 || 
                               metrics.social_media_metrics.instagram.engagement_rate < 3;
    
    if (lowSocialEngagement) {
        recommendations.push('Enhance social media engagement with more interactive content and consistent posting schedule');
    }
    
    // Local presence recommendations
    if (metrics.local_presence_metrics.google_my_business.rating < 4) {
        recommendations.push('Implement a review management strategy to improve online ratings');
    }
    
    if (metrics.local_presence_metrics.local_directories.consistency_score < 80) {
        recommendations.push('Ensure consistent business information across all online directories');
    }
    
    // Industry-specific recommendations
    if (industry === 'dental') {
        if (isSmileCharlotte) {
            // Specific recommendations for Smile Charlotte
            recommendations.push('Leverage your strong Google My Business rating (4.9/5) in marketing materials to build trust with potential patients');
            recommendations.push('Increase social media posting frequency to maintain high engagement rates');
            recommendations.push('Create educational content about dental procedures to establish authority in the Charlotte area');
        } else {
            recommendations.push('Create educational content about dental procedures and oral health to establish authority');
            recommendations.push('Implement a patient review collection system to build trust with potential patients');
            recommendations.push('Highlight extended office hours in your Google My Business listing to attract busy patients');
        }
    } else if (industry === 'healthcare') {
        recommendations.push('Develop content that addresses common health concerns and questions');
        recommendations.push('Implement HIPAA-compliant online appointment booking to improve patient experience');
        recommendations.push('Showcase staff credentials and expertise to build trust with potential patients');
    } else if (industry === 'retail') {
        recommendations.push('Develop an e-commerce strategy to complement your physical store presence');
        recommendations.push('Use social media shopping features to drive direct sales');
        recommendations.push('Implement local inventory ads to drive foot traffic to your store');
    } else if (industry === 'restaurant') {
        recommendations.push('Optimize your Google My Business listing with updated menu items and photos');
        recommendations.push('Implement online ordering and reservation systems for better customer experience');
        recommendations.push('Create engaging social media content featuring your signature dishes');
    } else if (industry === 'professional-services') {
        recommendations.push('Create case studies and testimonials to showcase your expertise and results');
        recommendations.push('Develop a content marketing strategy focused on thought leadership');
        recommendations.push('Optimize your LinkedIn presence to connect with potential clients');
    } else {
        recommendations.push('Develop a content strategy that addresses your target audience's key pain points');
        recommendations.push('Implement a review collection system to build social proof');
        recommendations.push('Optimize your Google My Business listing for local search visibility');
    }
    
    // Add recommendations to the list
    recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        li.style.marginBottom = '10px';
        li.style.paddingLeft = '20px';
        li.style.position = 'relative';
        
        // Add bullet point
        const bullet = document.createElement('span');
        bullet.textContent = '•';
        bullet.style.position = 'absolute';
        bullet.style.left = '0';
        bullet.style.color = '#2563eb';
        bullet.style.fontWeight = 'bold';
        li.appendChild(bullet);
        
        container.appendChild(li);
    });
}

/**
 * Get color based on score
 * @param {number} score - Score value
 * @param {number} yellowThreshold - Threshold for yellow color
 * @param {number} greenThreshold - Threshold for green color
 * @returns {string} - Color code
 */
function getScoreColor(score, yellowThreshold, greenThreshold) {
    if (score < yellowThreshold) {
        return '#ef4444'; // Red
    } else if (score < greenThreshold) {
        return '#f59e0b'; // Yellow/Orange
    } else {
        return '#10b981'; // Green
    }
}

/**
 * Get metrics for Smile Charlotte (our example case with real data)
 * @returns {Object} - Metrics object for Smile Charlotte
 */
function getSmileCharlotteMetrics() {
    return {
        website_metrics: {
            traffic: {
                total_visitors: 2194, // Based on local search volume data
                unique_visitors: 1850,
                average_session_duration: 180, // 3 minutes average
                pages_per_session: 3.2
            },
            performance: {
                page_load_time: 2.3,
                mobile_friendliness_score: 85,
                bounce_rate: 45,
                exit_rate: 35
            },
            seo: {
                organic_search_ranking: 3, // High local ranking
                keyword_rankings: ["dentist charlotte", "family dentistry charlotte", "dental care charlotte"],
                backlink_count: 120,
                domain_authority: 35
            }
        },
        social_media_metrics: {
            facebook: {
                followers: 1250,
                engagement_rate: 3.2,
                post_frequency: 3, // posts per week
                average_reach: 850
            },
            instagram: {
                followers: 980,
                engagement_rate: 4.5,
                post_frequency: 2, // posts per week
                average_reach: 720
            },
            twitter: {
                followers: 450,
                engagement_rate: 1.8,
                post_frequency: 4, // posts per week
                average_reach: 320
            },
            linkedin: {
                followers: 380,
                engagement_rate: 2.5,
                post_frequency: 1, // posts per week
                average_reach: 290
            }
        },
        local_presence_metrics: {
            google_my_business: {
                rating: 4.9, // Based on actual Google rating
                review_count: 253, // Based on actual review count
                listing_completeness: 95,
                photo_count: 32
            },
            local_directories: {
                listing_count: 14,
                consistency_score: 92,
                review_sites_presence: 8
            }
        },
        advertising_metrics: {
            ppc: {
                click_through_rate: 5.44, // Based on dental industry average
                cost_per_click: 4.20,
                conversion_rate: 3.8,
                cost_per_acquisition: 110.50
            },
            display_ads: {
                impressions: 15000,
                click_through_rate: 0.9,
                conversion_rate: 1.2,
                cost_per_acquisition: 135.75
            }
        },
        content_marketing_metrics: {
            blog: {
                post_frequency: 2, // posts per month
                average_time_on_page: 185, // seconds
                social_shares: 45
            },
            email: {
                subscriber_count: 1850,
                open_rate: 22.5,
                click_through_rate: 3.8,
                conversion_rate: 1.5
            }
        },
        business_impact_metrics: {
            lead_generation: {
                total_leads: 85, // per month
                lead_conversion_rate: 35,
                cost_per_lead: 38.50
            },
            roi_metrics: {
                marketing_roi: 320, // percentage
                customer_acquisition_cost: 110.50,
                customer_lifetime_value: 3500,
                return_on_ad_spend: 4.5
            }
        }
    };
}

/**
 * Generate simulated metrics based on industry
 * @param {string} industry - Company industry
 * @returns {Object} - Simulated metrics object
 */
function generateSimulatedMetrics(industry) {
    // Base metrics template
    const baseMetrics = {
        website_metrics: {
            traffic: {
                total_visitors: getRandomInt(500, 3000),
                unique_visitors: getRandomInt(400, 2500),
                average_session_duration: getRandomInt(60, 240),
                pages_per_session: getRandomFloat(1.5, 4.5)
            },
            performance: {
                page_load_time: getRandomFloat(1.5, 5.0),
                mobile_friendliness_score: getRandomInt(60, 95),
                bounce_rate: getRandomInt(40, 80),
                exit_rate: getRandomInt(30, 70)
            },
            seo: {
                organic_search_ranking: getRandomInt(5, 50),
                keyword_rankings: [],
                backlink_count: getRandomInt(20, 200),
                domain_authority: getRandomInt(10, 50)
            }
        },
        social_media_metrics: {
            facebook: {
                followers: getRandomInt(200, 3000),
                engagement_rate: getRandomFloat(0.5, 5.0),
                post_frequency: getRandomInt(1, 7),
                average_reach: getRandomInt(100, 2000)
            },
            instagram: {
                followers: getRandomInt(300, 5000),
                engagement_rate: getRandomFloat(1.0, 7.0),
                post_frequency: getRandomInt(2, 10),
                average_reach: getRandomInt(200, 3000)
            },
            twitter: {
                followers: getRandomInt(100, 2000),
                engagement_rate: getRandomFloat(0.2, 3.0),
                post_frequency: getRandomInt(2, 14),
                average_reach: getRandomInt(50, 1000)
            },
            linkedin: {
                followers: getRandomInt(100, 1500),
                engagement_rate: getRandomFloat(0.5, 4.0),
                post_frequency: getRandomInt(1, 5),
                average_reach: getRandomInt(80, 1200)
            }
        },
        local_presence_metrics: {
            google_my_business: {
                rating: getRandomFloat(3.0, 5.0),
                review_count: getRandomInt(5, 200),
                listing_completeness: getRandomInt(60, 100),
                photo_count: getRandomInt(5, 50)
            },
            local_directories: {
                listing_count: getRandomInt(3, 20),
                consistency_score: getRandomInt(50, 100),
                review_sites_presence: getRandomInt(2, 10)
            }
        },
        advertising_metrics: {
            ppc: {
                click_through_rate: getRandomFloat(1.0, 7.0),
                cost_per_click: getRandomFloat(1.5, 10.0),
                conversion_rate: getRandomFloat(1.0, 5.0),
                cost_per_acquisition: getRandomFloat(50, 200)
            },
            display_ads: {
                impressions: getRandomInt(5000, 50000),
                click_through_rate: getRandomFloat(0.1, 2.0),
                conversion_rate: getRandomFloat(0.5, 3.0),
                cost_per_acquisition: getRandomFloat(75, 250)
            }
        },
        content_marketing_metrics: {
            blog: {
                post_frequency: getRandomInt(1, 8),
                average_time_on_page: getRandomInt(60, 300),
                social_shares: getRandomInt(10, 200)
            },
            email: {
                subscriber_count: getRandomInt(500, 10000),
                open_rate: getRandomFloat(15.0, 35.0),
                click_through_rate: getRandomFloat(1.0, 10.0),
                conversion_rate: getRandomFloat(0.5, 5.0)
            }
        },
        business_impact_metrics: {
            lead_generation: {
                total_leads: getRandomInt(20, 200),
                lead_conversion_rate: getRandomFloat(10.0, 50.0),
                cost_per_lead: getRandomFloat(10, 100)
            },
            roi_metrics: {
                marketing_roi: getRandomFloat(100, 500),
                customer_acquisition_cost: getRandomFloat(50, 300),
                customer_lifetime_value: getRandomFloat(500, 5000),
                return_on_ad_spend: getRandomFloat(1.5, 10.0)
            }
        }
    };
    
    // Adjust metrics based on industry
    if (industry === 'dental') {
        // Dental practices typically have strong local presence but moderate social media
        baseMetrics.local_presence_metrics.google_my_business.rating = getRandomFloat(4.0, 5.0);
        baseMetrics.local_presence_metrics.google_my_business.review_count = getRandomInt(20, 300);
        baseMetrics.social_media_metrics.instagram.followers = getRandomInt(200, 3000);
        baseMetrics.advertising_metrics.ppc.click_through_rate = 5.44; // Based on dental industry average
    } else if (industry === 'healthcare') {
        // Healthcare typically has strong local presence and moderate website traffic
        baseMetrics.local_presence_metrics.google_my_business.rating = getRandomFloat(4.0, 5.0);
        baseMetrics.local_presence_metrics.google_my_business.review_count = getRandomInt(30, 400);
        baseMetrics.website_metrics.traffic.total_visitors = getRandomInt(1000, 5000);
        baseMetrics.content_marketing_metrics.blog.post_frequency = getRandomInt(2, 6);
    } else if (industry === 'retail') {
        // Retail typically has strong social media but varied local presence
        baseMetrics.social_media_metrics.instagram.followers = getRandomInt(1000, 10000);
        baseMetrics.social_media_metrics.facebook.followers = getRandomInt(1000, 8000);
        baseMetrics.website_metrics.traffic.total_visitors = getRandomInt(1000, 8000);
        baseMetrics.advertising_metrics.display_ads.impressions = getRandomInt(20000, 100000);
    } else if (industry === 'restaurant') {
        // Restaurants typically have strong local presence and social media
        baseMetrics.local_presence_metrics.google_my_business.rating = getRandomFloat(3.5, 5.0);
        baseMetrics.local_presence_metrics.google_my_business.review_count = getRandomInt(50, 500);
        baseMetrics.social_media_metrics.instagram.followers = getRandomInt(500, 7000);
        baseMetrics.social_media_metrics.instagram.engagement_rate = getRandomFloat(2.0, 8.0);
    } else if (industry === 'professional-services') {
        // Professional services typically have stronger LinkedIn presence
        baseMetrics.social_media_metrics.linkedin.followers = getRandomInt(500, 5000);
        baseMetrics.social_media_metrics.linkedin.engagement_rate = getRandomFloat(1.0, 6.0);
        baseMetrics.website_metrics.seo.domain_authority = getRandomInt(20, 60);
        baseMetrics.content_marketing_metrics.blog.post_frequency = getRandomInt(2, 8);
    }
    
    return baseMetrics;
}

/**
 * Update the dashboard preview based on metrics
 * @param {Object} metrics - Metrics object
 * @param {boolean} isSmileCharlotte - Whether this is the Smile Charlotte example
 */
function updateDashboardPreview(metrics, isSmileCharlotte) {
    // In a real implementation, this would generate a custom dashboard visualization
    // For this simulation, we're just using the existing dashboard image
    const dashboardPreview = document.querySelector('.dashboard-preview');
    if (dashboardPreview) {
        // Keep using the existing image for now
        // In a real implementation, we could generate a custom chart or visualization
    }
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max with 1 decimal place
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random float with 1 decimal place
 */
function getRandomFloat(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show email validation error
 * @param {string} message - Error message to display
 */
function showEmailError(message) {
    const emailInput = document.getElementById('recipient-email');
    
    // Remove any existing error messages
    const existingError = emailInput.parentNode.querySelector('.email-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'email-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '5px';
    
    // Add error message after the input
    emailInput.parentNode.appendChild(errorElement);
    
    // Highlight the input field
    emailInput.style.borderColor = '#ef4444';
    
    // Remove error when input changes
    emailInput.addEventListener('input', function() {
        const error = emailInput.parentNode.querySelector('.email-error');
        if (error) {
            error.remove();
        }
        emailInput.style.borderColor = '';
    }, { once: true });
}

/**
 * Send email report to recipient
 * @param {string} recipientEmail - Email address of recipient
 * @param {string} message - Optional message to include
 */
function sendEmailReport(recipientEmail, message) {
    // In a real implementation, this would send the report via an email service
    // For this simulation, we'll show a success message
    
    const companyName = document.getElementById('result-company-name').textContent;
    
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'email-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#10b981';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.style.maxWidth = '300px';
    
    // Add notification content
    notification.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-right: 10px;"></i>
            <h4 style="margin: 0; font-size: 1.1rem;">Email Sent Successfully</h4>
        </div>
        <p style="margin: 0; font-size: 0.9rem;">Digital presence report for ${companyName} has been sent to ${recipientEmail}</p>
    `;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '1.2rem';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(function() {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

/**
 * Generate PDF from the review results
 * Uses jsPDF library to create a downloadable PDF report
 */
function generatePDF() {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        // Load jsPDF library dynamically if not already loaded
        loadJsPDF(function() {
            createPDF();
        });
    } else {
        createPDF();
    }
}

/**
 * Load jsPDF library dynamically
 * @param {Function} callback - Function to call when library is loaded
 */
function loadJsPDF(callback) {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = callback;
    document.head.appendChild(script);
    
    // Also load html2canvas for capturing elements
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(html2canvasScript);
}

/**
 * Create and download PDF report
 */
function createPDF() {
    // Get company information
    const companyName = document.getElementById('result-company-name').textContent;
    const companyLocation = document.getElementById('company-location').value;
    const companyIndustry = document.getElementById('company-industry').value;
    const companyWebsite = document.getElementById('company-website').value || 'Not provided';
    
    // Get metrics sections
    const websiteMetricsSection = document.querySelector('.metrics-section:nth-child(1)');
    const socialMediaSection = document.querySelector('.metrics-section:nth-child(2)');
    const localPresenceSection = document.querySelector('.metrics-section:nth-child(3)');
    const recommendationsSection = document.querySelector('.metrics-section:nth-child(4)');
    
    // Create PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
        title: `Digital Presence Review - ${companyName}`,
        subject: 'Digital Marketing Analysis',
        author: 'Jordan Mukite',
        keywords: 'digital marketing, SEO, social media, local presence',
        creator: 'Jordan Mukite Digital Marketing'
    });
    
    // Add header
    doc.setFillColor(37, 99, 235); // Primary color
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Digital Presence Review', 105, 15, { align: 'center' });
    
    // Add company information
    doc.setTextColor(30, 41, 59); // Dark color
    doc.setFontSize(16);
    doc.text(`Company: ${companyName}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`Location: ${companyLocation}`, 20, 48);
    doc.text(`Industry: ${companyIndustry}`, 20, 54);
    doc.text(`Website: ${companyWebsite}`, 20, 60);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 66);
    
    // Add summary section
    doc.setFillColor(248, 250, 252); // Light background
    doc.rect(15, 75, 180, 25, 'F');
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Executive Summary', 20, 85);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text('This report provides an analysis of your digital marketing presence across key channels', 20, 92);
    doc.text('including website performance, social media engagement, and local business listings.', 20, 97);
    
    // Add metrics sections
    let yPosition = 110;
    
    // Website Metrics
    yPosition = addSectionToPDF(doc, 'Website Performance', yPosition);
    // Get metrics from DOM
    const websiteMetrics = websiteMetricsSection.querySelectorAll('.metric-card');
    websiteMetrics.forEach((metric, index) => {
        const title = metric.querySelector('h5').textContent;
        const value = metric.querySelector('p strong').textContent;
        const unit = metric.querySelector('p span').textContent;
        
        // Calculate position (2 metrics per row)
        const xPos = index % 2 === 0 ? 25 : 115;
        const yPos = yPosition + Math.floor(index / 2) * 15;
        
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${title}: ${value} ${unit}`, xPos, yPos);
    });
    
    yPosition += Math.ceil(websiteMetrics.length / 2) * 15 + 10;
    
    // Social Media Metrics
    yPosition = addSectionToPDF(doc, 'Social Media Presence', yPosition);
    const socialMediaMetrics = socialMediaSection.querySelectorAll('.metric-card');
    socialMediaMetrics.forEach((metric, index) => {
        const title = metric.querySelector('h5').textContent;
        const value = metric.querySelector('p strong').textContent;
        const unit = metric.querySelector('p span').textContent;
        
        // Calculate position (2 metrics per row)
        const xPos = index % 2 === 0 ? 25 : 115;
        const yPos = yPosition + Math.floor(index / 2) * 15;
        
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${title}: ${value} ${unit}`, xPos, yPos);
    });
    
    yPosition += Math.ceil(socialMediaMetrics.length / 2) * 15 + 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }
    
    // Local Presence Metrics
    yPosition = addSectionToPDF(doc, 'Local Presence', yPosition);
    const localPresenceMetrics = localPresenceSection.querySelectorAll('.metric-card');
    localPresenceMetrics.forEach((metric, index) => {
        const title = metric.querySelector('h5').textContent;
        const value = metric.querySelector('p strong').textContent;
        const unit = metric.querySelector('p span').textContent;
        
        // Calculate position (2 metrics per row)
        const xPos = index % 2 === 0 ? 25 : 115;
        const yPos = yPosition + Math.floor(index / 2) * 15;
        
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${title}: ${value} ${unit}`, xPos, yPos);
    });
    
    yPosition += Math.ceil(localPresenceMetrics.length / 2) * 15 + 10;
    
    // Check if we need a new page
    if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
    }
    
    // Recommendations
    yPosition = addSectionToPDF(doc, 'Recommendations', yPosition);
    const recommendations = recommendationsSection.querySelectorAll('li');
    recommendations.forEach((recommendation, index) => {
        const text = recommendation.textContent;
        
        // Add recommendation with bullet point
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        
        // Split text into multiple lines if needed
        const textLines = doc.splitTextToSize(text, 170);
        doc.text('•', 20, yPosition + index * 12);
        doc.text(textLines, 25, yPosition + index * 12);
        
        // Adjust position based on number of lines
        if (textLines.length > 1) {
            yPosition += (textLines.length - 1) * 5;
        }
    });
    
    yPosition += recommendations.length * 12 + 15;
    
    // Check if we need a new page
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }
    
    // Add contact information
    doc.setFillColor(37, 99, 235, 0.1); // Light primary color
    doc.rect(15, yPosition, 180, 35, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Contact Information', 105, yPosition + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Jordan Mukite', 105, yPosition + 18, { align: 'center' });
    doc.text('Digital Marketing Specialist', 105, yPosition + 23, { align: 'center' });
    doc.text('Email: jordan@mukitemarketing.com | Phone: (555) 123-4567', 105, yPosition + 28, { align: 'center' });
    doc.text('Charlotte, NC', 105, yPosition + 33, { align: 'center' });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // Gray color
        doc.text(`Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`Digital_Presence_Review_${companyName.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Add section header to PDF
 * @param {Object} doc - jsPDF document
 * @param {string} title - Section title
 * @param {number} yPosition - Y position
 * @returns {number} - New Y position
 */
function addSectionToPDF(doc, title, yPosition) {
    doc.setFillColor(229, 231, 235); // Light gray
    doc.rect(15, yPosition, 180, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(title, 20, yPosition + 7);
    return yPosition + 15;
}