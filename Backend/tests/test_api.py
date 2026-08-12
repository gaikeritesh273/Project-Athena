import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "ATHENA" in response.json()["name"]

def test_claims_demo():
    response = client.get("/claims/demo")
    assert response.status_code == 200
    assert len(response.json()["demo_claims"]) > 0

def test_claims_analyze():
    response = client.post("/claims/analyze", json={"text": "Climate change is real"})
    assert response.status_code == 200
    data = response.json()
    assert "claims" in data
    assert len(data["claims"]) > 0

def test_bias_detect():
    response = client.post("/bias/detect", json={"text": "This is absolutely terrifying! Everyone knows this is the worst thing ever!"})
    assert response.status_code == 200
    data = response.json()
    assert "flags" in data
    assert data["overall_bias_score"] > 0

def test_source_score():
    response = client.post("/source/score", json={"url": "https://bbc.com/news"})
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert data["overall_score"] > 50

def test_quiz_questions():
    response = client.post("/quiz/questions", json={"limit": 3})
    assert response.status_code == 200
    assert len(response.json()["questions"]) > 0

def test_quiz_categories():
    response = client.get("/quiz/categories")
    assert response.status_code == 200
    assert "categories" in response.json()

def test_source_dataset():
    response = client.get("/source/dataset")
    assert response.status_code == 200
    assert "dataset" in response.json()

def test_bias_reference():
    response = client.get("/bias/flags-reference")
    assert response.status_code == 200
    assert "emotional_triggers" in response.json()

def test_forensics_health():
    response = client.get("/forensics/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_investigate_demo():
    response = client.get("/investigate/demo")
    assert response.status_code == 200
    data = response.json()
    assert "trust_passport" in data
    assert "perspective_explorer" in data
    assert "narrative_memory" in data
    assert "ai_tutor" in data

def test_investigate_full():
    response = client.post("/investigate/full", json={"text": "Test viral claim text", "is_demo": False})
    assert response.status_code == 200
    data = response.json()
    assert "trust_passport" in data

