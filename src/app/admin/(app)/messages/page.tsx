import type { Metadata } from "next";
import { Reply } from "lucide-react";
import { deleteMessage, setMessageRead } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/FormParts";
import { PageHeader } from "@/components/admin/PageHeader";
import styles from "@/components/admin/admin.module.css";
import page from "./page.module.css";
import { getMessages } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Messages" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Abidjan",
});

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle={`${messages.length} message${messages.length > 1 ? "s" : ""}, dont ${unread} non lu${unread > 1 ? "s" : ""}.`}
      />

      {messages.length === 0 ? (
        <p className={styles.empty}>Aucun message pour l’instant.</p>
      ) : (
        <ul className={styles.rows}>
          {messages.map((m) => {
            const subject = encodeURIComponent(`Re : ${m.topic}`);
            return (
              <li key={m.id} className={`${styles.row} ${page.message}`} data-unread={!m.read || undefined}>
                <div className={styles.rowMain}>
                  <div className={styles.rowMeta}>
                    {!m.read && <span className={`${styles.status} ${styles.statusWarning}`}>Non lu</span>}
                    <span className={`${styles.status} ${styles.statusOk}`}>{m.topic}</span>
                    <time dateTime={m.createdAt.toISOString()}>{dateFormat.format(m.createdAt)}</time>
                  </div>
                  <p className={styles.rowTitle}>
                    {m.name} <span className={page.email}>&lt;{m.email}&gt;</span>
                  </p>
                  <p className={page.body}>{m.body}</p>
                </div>
                <div className={styles.rowActions}>
                  <a href={`mailto:${m.email}?subject=${subject}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                    <Reply size={16} strokeWidth={1.75} aria-hidden="true" />
                    Répondre
                  </a>
                  <form action={setMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={String(!m.read)} />
                    <button type="submit" className={styles.btn}>
                      {m.read ? "Marquer non lu" : "Marquer lu"}
                    </button>
                  </form>
                  <DeleteButton action={deleteMessage} id={m.id} itemName={`message de ${m.name}`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
