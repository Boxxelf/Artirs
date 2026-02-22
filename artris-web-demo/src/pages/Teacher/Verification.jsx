import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Upload, GraduationCap, File, Loader } from 'lucide-react';
import { useAlert } from '../../hooks/useAlert.jsx';

export default function Verification() {
  const { t, i18n } = useTranslation();
  const { showAlert, AlertComponent } = useAlert();
  const [verificationStatus, setVerificationStatus] = useState(() => {
    // Check localStorage for saved status
    const saved = localStorage.getItem('teacher_verification_status');
    return saved || 'none'; // none, pending, verified, rejected
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    major: '',
    graduationYear: '',
  });
  const [diplomaFile, setDiplomaFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);

  useEffect(() => {
    // Simulate verification process if status is pending
    if (verificationStatus === 'pending') {
      const submitted = localStorage.getItem('verification_submitted_at');
      if (submitted) {
        const submitTime = new Date(submitted).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - submitTime) / (1000 * 60 * 60);
        
        // Auto-approve after 24 hours (simulating review process)
        if (hoursPassed >= 24) {
          setVerificationStatus('verified');
          localStorage.setItem('teacher_verification_status', 'verified');
        }
      }
    }
  }, [verificationStatus]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'diploma') {
        setDiplomaFile(file);
      } else {
        setTranscriptFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diplomaFile || !transcriptFile) {
      showAlert({
        type: 'warning',
        title: i18n.language === 'en' ? 'Files Required' : '需要上传文件',
        message: i18n.language === 'en' 
          ? 'Please upload both diploma and transcript files'
          : '请上传毕业证书和成绩单文件',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save submission
    const submitTime = new Date().toISOString();
    localStorage.setItem('verification_submitted_at', submitTime);
    localStorage.setItem('teacher_verification_status', 'pending');
    setSubmittedAt(submitTime);
    setVerificationStatus('pending');
    setIsSubmitting(false);
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'verified':
        return t('teacher.verification.verified');
      case 'rejected':
        return t('teacher.verification.rejected');
      case 'pending':
        return t('teacher.verification.pending');
      default:
        return i18n.language === 'en' ? 'Not Submitted' : '未提交';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'verified':
        return i18n.language === 'en'
          ? 'Your education credentials have been verified. You can now accept students.'
          : '您的教育凭证已通过验证。您现在可以接受学生了。';
      case 'rejected':
        return i18n.language === 'en'
          ? 'Your verification was rejected. Please review your documents and resubmit.'
          : '您的认证被拒绝。请检查您的文件并重新提交。';
      case 'pending':
        return i18n.language === 'en'
          ? 'Your documents are under review. This process typically takes 24-48 hours.'
          : '您的文件正在审核中。此过程通常需要24-48小时。';
      default:
        return i18n.language === 'en'
          ? 'Please submit your education credentials for verification.'
          : '请提交您的教育凭证进行验证。';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('teacher.verification.title')}</h1>

      {/* Status Card */}
      {verificationStatus !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card mb-8 ${
            verificationStatus === 'verified' ? 'bg-green-50 border-green-200' :
            verificationStatus === 'rejected' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{t('teacher.verification.status')}</h3>
              <p className="text-gray-600 mb-1">{getStatusText()}</p>
              <p className="text-sm text-gray-500">{getStatusDescription()}</p>
              {verificationStatus === 'pending' && submittedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  {i18n.language === 'en'
                    ? `Submitted on ${new Date(submittedAt).toLocaleDateString()}`
                    : `提交于 ${new Date(submittedAt).toLocaleDateString()}`
                  }
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Verification Form */}
      {verificationStatus !== 'verified' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <GraduationCap className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">
              {i18n.language === 'en' ? 'Education Information' : '教育信息'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.school')}
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., RISD, Parsons, ArtCenter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.degree')}
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">
                  {i18n.language === 'en' ? 'Select Degree' : '选择学位'}
                </option>
                <option value="B.F.A.">B.F.A. (Bachelor of Fine Arts)</option>
                <option value="M.F.A.">M.F.A. (Master of Fine Arts)</option>
                <option value="B.A.">B.A. (Bachelor of Arts)</option>
                <option value="M.A.">M.A. (Master of Arts)</option>
                <option value="B.Arch">B.Arch (Bachelor of Architecture)</option>
                <option value="M.Arch">M.Arch (Master of Architecture)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.major')}
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Illustration, Product Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.graduationYear')}
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 2020"
                min="1950"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.uploadDiploma')}
              </label>
              <label className="block">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  diplomaFile 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}>
                  {diplomaFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="w-6 h-6 text-green-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-700">{diplomaFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(diplomaFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {i18n.language === 'en'
                          ? 'Click to upload or drag and drop'
                          : '点击上传或拖放文件'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'diploma')}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('teacher.verification.uploadTranscript')}
              </label>
              <label className="block">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  transcriptFile 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}>
                  {transcriptFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="w-6 h-6 text-green-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-700">{transcriptFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(transcriptFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {i18n.language === 'en'
                          ? 'Click to upload or drag and drop'
                          : '点击上传或拖放文件'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'transcript')}
                  className="hidden"
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || verificationStatus === 'pending'}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>
                    {i18n.language === 'en' ? 'Submitting...' : '提交中...'}
                  </span>
                </>
              ) : (
                <span>{t('teacher.verification.submit')}</span>
              )}
            </button>
          </form>
        </motion.div>
      )}

      <AlertComponent />
    </div>
  );
}
