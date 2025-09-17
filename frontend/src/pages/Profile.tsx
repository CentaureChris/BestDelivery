import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getMe, updateMe, type Me } from "../api/apiUser";
import commonStyles from "../assets/css/CommonStyles.module.css";
import styles from "../assets/css/Profile.module.css";

const Profile: React.FC = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getMe()
      .then((u) => {
        setMe(u);
        setForm((f) => ({
          ...f,
          name: u.name ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
        }));
      })
      .catch((e) => {
        setMsg({ type: "error", text: "Impossible de récupérer votre profil." });
        console.error(e);
      });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
      };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      const updated = await updateMe(payload);
      setMe(updated);
      setMsg({ type: "success", text: "Profil mis à jour avec succès." });
      // clear password fields
      setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
    } catch (e: any) {
      setMsg({
        type: "error",
        text: e?.response?.data?.message || "Échec de la mise à jour du profil.",
      });
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className={commonStyles.layout}>
      <aside className={`${styles.sidebarWrap} ${sidebarOpen ? styles.open : styles.closed}`}>
        <Sidebar />
      </aside>

      <div className={styles.content}>
        <Navbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <main className={styles.container}>
          <header className={styles.headerRow}>
            <h2 className={styles.title}>Mon Profil</h2>
            <Link to="/"
              className={`${styles.neuBtn} ${styles.ghost}`}
              title="Voir l'historique des tournées"
            >
              Historique
            </Link>
          </header>

          <section className={styles.card}>
            {!me ? (
              <div className={styles.muted}>Chargement…</div>
            ) : (
              <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nom</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="vous@exemple.com"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Téléphone</label>
                    <input
                      className={styles.input}
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+33…"
                    />
                  </div>
                </div>

                <div className={styles.separator} />

                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nouveau mot de passe</label>
                    <input
                      className={styles.input}
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder="Laisser vide pour ne pas changer"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Confirmation</label>
                    <input
                      className={styles.input}
                      type="password"
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={onChange}
                      placeholder="Répétez le mot de passe"
                    />
                  </div>
                </div>

                {msg && (
                  <div className={`${styles.alert} ${msg.type === "success" ? styles.ok : styles.err}`}>
                    {msg.text}
                  </div>
                )}

                <div className={styles.actions}>
                  <button className={`${styles.neuBtn} ${styles.primary}`} type="submit" disabled={saving}>
                    {saving ? "Enregistrement…" : "Enregistrer"}
                  </button>
                  <Link to="/" className={styles.neuBtn}>Annuler</Link>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;