import { useCallback, useEffect, useState } from 'react';
import {
  getMessages,
  markAsRead,
  type ContactMessage,
} from '../api/contact';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToasts } from '../components/Toast';

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toasts, dismiss, success, error: toastError } = useToasts();

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages();
      // Tri : non lus d'abord, puis plus récents
      const sorted = [...data].sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setMessages(sorted);
    } catch {
      setError('Impossible de charger les messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleMarkAsRead = async (message: ContactMessage) => {
    if (message.read) return;
    setUpdatingId(message.id);
    try {
      const updated = await markAsRead(message.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, read: true } : m)),
      );
      success('Message marqué comme lu.');
    } catch {
      toastError('Échec de la mise à jour du message.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="animate-fade-in">
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-subtitle">
            {unreadCount > 0
              ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}.`
              : 'Tous les messages sont lus.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">
          <LoadingSpinner label="Chargement des messages..." />
        </div>
      ) : error ? (
        <div className="error-banner">
          {error}
          <button className="btn btn-sm btn-secondary mt-sm" onClick={loadMessages}>
            Réessayer
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-title">Aucun message</div>
            <div className="empty-state-text">
              Aucun message reçu pour le moment.
            </div>
          </div>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-card ${message.read ? '' : 'message-unread'}`}
            >
              <div className="message-header">
                <div className="flex items-center gap-sm">
                  {!message.read && (
                    <span className="message-dot" aria-label="Non lu" />
                  )}
                  <span className="message-name">{message.name}</span>
                  {!message.read && (
                    <span className="badge badge-accent">Non lu</span>
                  )}
                </div>
                <span className="message-date text-muted text-sm">
                  {formatDate(message.createdAt)}
                </span>
              </div>

              <a
                href={`mailto:${message.email}`}
                className="message-email text-sm"
              >
                {message.email}
              </a>

              <p className="message-body">{message.message}</p>

              <div className="message-actions">
                {!message.read && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAsRead(message)}
                    disabled={updatingId === message.id}
                  >
                    {updatingId === message.id
                      ? 'Mise à jour...'
                      : 'Marquer comme lu'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
