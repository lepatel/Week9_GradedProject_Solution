import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaRobot } from 'react-icons/fa';

import { fetchQuestionById } from '../../reducers/questionSlice.js';
import { summarizeAnswers } from '../../services/aiService.js';
import QuestionContent from '../../components/Question/QuestionContent.jsx';
import AnswerList from '../../components/Answer/AnswerList.jsx';
import AnswerForm from '../../components/Answer/AnswerForm.jsx';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { currentQuestion, loading, error } = useSelector((state) => state.question);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestionById(id));
    setSummary(null);
  }, [id, dispatch]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const answerTexts = currentQuestion.answers.map((a) => a.answerText || a.text || '');
      const text = await summarizeAnswers(
        { question: currentQuestion.title, answers: answerTexts },
        userInfo?.token,
      );
      setSummary(text);
    } catch (err) {
      console.error('Summarize failed:', err);
      alert('Failed to summarize answers. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (loading) {
    return (
      <Container className="qd-loading-container">
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="qd-loading-container">
        <p>Error loading question: {error}</p>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="qd-loading-container">
        <p>Question not found.</p>
      </Container>
    );
  }

  const answerCount = currentQuestion.answers?.length ?? 0;
  const showSummarizeBtn = userInfo && answerCount >= 3 && !summary;

  return (
    <Container className="qd-container">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <QuestionContent
            question={currentQuestion}
          />

          {summary && (
            <Alert className="qd-summary-banner" onClose={() => setSummary(null)} dismissible>
              <div className="qd-summary-header">
                <FaRobot className="me-2" />
                <strong>AI Summary</strong>
              </div>
              <p className="qd-summary-text mb-0">{summary}</p>
            </Alert>
          )}

          {showSummarizeBtn && (
            <div className="qd-summarize-wrap">
              <Button
                variant="outline-primary"
                size="sm"
                className="qd-summarize-btn"
                onClick={handleSummarize}
                disabled={isSummarizing}
              >
                <FaRobot className="me-2" />
                {isSummarizing ? 'Summarizing...' : 'Summarize Answers'}
              </Button>
            </div>
          )}

          <AnswerList
            answers={currentQuestion.answers}
          />
          
          <AnswerForm
            questionId={id}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionDetail;