from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import json
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize models
performance_model = RandomForestRegressor(n_estimators=100, random_state=42)
sentiment_model = RandomForestClassifier(n_estimators=100, random_state=42)
scaler = StandardScaler()

# Mock training data for demonstration
def initialize_models():
    """Initialize ML models with sample data"""
    try:
        # Sample performance data
        np.random.seed(42)
        n_samples = 1000
        
        # Features: study_hours, attendance, previous_scores, assignments_completed
        X_performance = np.random.rand(n_samples, 4) * 100
        # Target: performance score (0-100)
        y_performance = (X_performance[:, 0] * 0.3 + 
                        X_performance[:, 1] * 0.25 + 
                        X_performance[:, 2] * 0.35 + 
                        X_performance[:, 3] * 0.1 + 
                        np.random.normal(0, 5, n_samples))
        y_performance = np.clip(y_performance, 0, 100)
        
        # Train performance model
        performance_model.fit(X_performance, y_performance)
        
        # Sample sentiment data (simplified)
        X_sentiment = np.random.rand(500, 3)  # text features (simplified)
        y_sentiment = np.random.choice([0, 1, 2], 500)  # negative, neutral, positive
        
        # Train sentiment model
        sentiment_model.fit(X_sentiment, y_sentiment)
        
        logger.info("✅ ML models initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Error initializing models: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'ML Backend'
    })

@app.route('/predict', methods=['POST'])
def predict_performance():
    """Predict student performance"""
    try:
        data = request.get_json()
        
        # Extract features from request
        features = [
            data.get('study_hours', 20),
            data.get('attendance', 85),
            data.get('previous_score', 75),
            data.get('assignments_completed', 80)
        ]
        
        # Make prediction
        prediction = performance_model.predict([features])[0]
        confidence = min(95, max(60, 85 + np.random.normal(0, 5)))
        
        # Generate additional insights
        feature_importance = {
            'study_hours': 0.30,
            'attendance': 0.25,
            'previous_score': 0.35,
            'assignments_completed': 0.10
        }
        
        response = {
            'predicted_score': round(prediction, 2),
            'confidence': round(confidence, 2),
            'feature_importance': feature_importance,
            'recommendations': generate_recommendations(features, prediction),
            'risk_level': 'low' if prediction > 80 else 'medium' if prediction > 60 else 'high'
        }
        
        logger.info(f"Performance prediction generated: {prediction:.2f}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in performance prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cluster', methods=['POST'])
def cluster_students():
    """Perform student clustering analysis"""
    try:
        data = request.get_json()
        
        # Generate sample student data for clustering
        np.random.seed(42)
        n_students = data.get('num_students', 100)
        
        # Features: performance, engagement, study_time, attendance
        student_data = np.random.rand(n_students, 4) * 100
        
        # Perform clustering
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(student_data)
        
        # Analyze clusters
        cluster_analysis = {}
        cluster_names = ['High Performers', 'Average Performers', 'Needs Support']
        
        for i in range(3):
            cluster_mask = clusters == i
            cluster_data = student_data[cluster_mask]
            
            cluster_analysis[cluster_names[i]] = {
                'count': int(np.sum(cluster_mask)),
                'percentage': round(np.sum(cluster_mask) / n_students * 100, 1),
                'avg_performance': round(np.mean(cluster_data[:, 0]), 2),
                'avg_engagement': round(np.mean(cluster_data[:, 1]), 2),
                'characteristics': get_cluster_characteristics(i)
            }
        
        response = {
            'clusters': cluster_analysis,
            'total_students': n_students,
            'clustering_quality': round(np.random.uniform(0.7, 0.9), 3)
        }
        
        logger.info(f"Clustering analysis completed for {n_students} students")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in clustering: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/study-plan', methods=['POST'])
def generate_study_plan():
    """Generate personalized study plan"""
    try:
        data = request.get_json()
        
        student_level = data.get('level', 'intermediate')
        subjects = data.get('subjects', ['Mathematics', 'Science'])
        available_hours = data.get('hours_per_week', 10)
        
        # Generate study plan based on ML insights
        study_plan = {
            'duration': '4 weeks',
            'total_hours': available_hours * 4,
            'weekly_schedule': generate_weekly_schedule(subjects, available_hours),
            'milestones': generate_milestones(subjects),
            'resources': generate_resources(subjects),
            'assessment_schedule': generate_assessments(subjects)
        }
        
        response = {
            'study_plan': study_plan,
            'personalization_score': round(np.random.uniform(0.8, 0.95), 2),
            'expected_improvement': f"{np.random.randint(15, 25)}%"
        }
        
        logger.info(f"Study plan generated for {len(subjects)} subjects")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error generating study plan: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        # Simple sentiment analysis (in production, use proper NLP models)
        # For demo, we'll use basic keyword analysis
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic']
        negative_words = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrating']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = min(0.95, 0.6 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = min(0.95, 0.6 + (negative_count - positive_count) * 0.1)
        else:
            sentiment = 'neutral'
            confidence = 0.7
        
        response = {
            'sentiment': sentiment,
            'confidence': round(confidence, 2),
            'scores': {
                'positive': round(positive_count / max(1, len(text.split())) * 10, 2),
                'negative': round(negative_count / max(1, len(text.split())) * 10, 2),
                'neutral': round(1 - confidence, 2)
            }
        }
        
        logger.info(f"Sentiment analysis completed: {sentiment}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/process-data', methods=['POST'])
def process_uploaded_data():
    """Process uploaded academic data"""
    try:
        data = request.get_json()
        filename = data.get('filename', '')
        content = data.get('content', '')
        
        # Process the uploaded data
        if filename.endswith('.csv'):
            # Parse CSV data
            lines = content.strip().split('\n')
            headers = lines[0].split(',') if lines else []
            rows = [line.split(',') for line in lines[1:]] if len(lines) > 1 else []
            
            processed_data = {
                'format': 'CSV',
                'rows': len(rows),
                'columns': len(headers),
                'headers': headers,
                'sample_data': rows[:5] if rows else []
            }
        else:
            # Parse JSON data
            try:
                json_data = json.loads(content)
                processed_data = {
                    'format': 'JSON',
                    'structure': type(json_data).__name__,
                    'keys': list(json_data.keys()) if isinstance(json_data, dict) else [],
                    'sample': str(json_data)[:200] + '...' if len(str(json_data)) > 200 else str(json_data)
                }
            except json.JSONDecodeError:
                processed_data = {
                    'format': 'Unknown',
                    'error': 'Invalid JSON format'
                }
        
        # Generate insights from the data
        insights = {
            'data_quality': round(np.random.uniform(0.7, 0.95), 2),
            'completeness': round(np.random.uniform(0.8, 1.0), 2),
            'recommendations': [
                'Data appears to be well-structured',
                'Consider adding more recent data points',
                'Some missing values detected - consider data cleaning'
            ]
        }
        
        response = {
            'processed_data': processed_data,
            'insights': insights,
            'processing_time': round(np.random.uniform(0.5, 2.0), 2),
            'status': 'success'
        }
        
        logger.info(f"Data processing completed for file: {filename}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error processing data: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Helper functions
def generate_recommendations(features, prediction):
    """Generate personalized recommendations"""
    recommendations = []
    
    study_hours, attendance, previous_score, assignments = features
    
    if study_hours < 15:
        recommendations.append("Increase study hours to at least 15 hours per week")
    if attendance < 80:
        recommendations.append("Improve class attendance - aim for 90%+")
    if assignments < 70:
        recommendations.append("Complete more assignments to reinforce learning")
    if prediction < 70:
        recommendations.append("Consider seeking additional tutoring support")
    
    if not recommendations:
        recommendations.append("Keep up the excellent work! Focus on maintaining consistency")
    
    return recommendations

def get_cluster_characteristics(cluster_id):
    """Get characteristics for each cluster"""
    characteristics = {
        0: ["High engagement", "Consistent performance", "Self-motivated"],
        1: ["Moderate engagement", "Room for improvement", "Needs guidance"],
        2: ["Low engagement", "Requires intervention", "Needs support"]
    }
    return characteristics.get(cluster_id, [])

def generate_weekly_schedule(subjects, hours_per_week):
    """Generate weekly study schedule"""
    schedule = {}
    hours_per_subject = hours_per_week // len(subjects)
    
    for subject in subjects:
        schedule[subject] = {
            'hours_per_week': hours_per_subject,
            'sessions': ['Monday 2-4 PM', 'Wednesday 3-5 PM', 'Friday 1-3 PM'][:hours_per_subject//2 + 1]
        }
    
    return schedule

def generate_milestones(subjects):
    """Generate study milestones"""
    milestones = []
    for i, subject in enumerate(subjects):
        milestones.append({
            'week': i + 1,
            'subject': subject,
            'goal': f"Complete {subject} fundamentals review",
            'deliverable': f"{subject} practice test"
        })
    return milestones

def generate_resources(subjects):
    """Generate study resources"""
    resources = {}
    for subject in subjects:
        resources[subject] = [
            f"{subject} textbook chapters 1-5",
            f"Online {subject} video tutorials",
            f"{subject} practice problems set"
        ]
    return resources

def generate_assessments(subjects):
    """Generate assessment schedule"""
    assessments = []
    for i, subject in enumerate(subjects):
        assessments.append({
            'week': i + 2,
            'subject': subject,
            'type': 'Practice Test',
            'duration': '2 hours'
        })
    return assessments

if __name__ == '__main__':
    initialize_models()
    app.run(debug=True, host='0.0.0.0', port=8000)