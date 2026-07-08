// Illustrative React example — drop into any React + bundler setup
// (Vite, Next.js, CRA, etc.) after `npm install @sahinur/forgedata react`.
import { ForgeDataProvider, useGenerator } from "@sahinur/forgedata/react";

function UserCard({ userId }: { userId: string }) {
  const user = useGenerator(
    (forge) => ({
      name: forge.person.fullName(),
      email: forge.internet.email(),
      avatar: forge.image.avatar(),
      jobTitle: forge.person.jobTitle(),
    }),
    [userId],
  );

  return (
    <div>
      <img src={user.avatar} alt="" width={48} height={48} />
      <p>
        <strong>{user.name}</strong> — {user.jobTitle}
      </p>
      <p>{user.email}</p>
    </div>
  );
}

export default function App() {
  return (
    <ForgeDataProvider seed="react-example" locale="en">
      <UserCard userId="user-1" />
      <UserCard userId="user-2" />
    </ForgeDataProvider>
  );
}
