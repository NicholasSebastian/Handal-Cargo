import { FC, PropsWithChildren, useState, useEffect, useContext, createContext } from "react";
import styled from "styled-components";
import { Spin, message } from "antd";
import useDatabase, { useUser, logoutAndClose } from "./useDatabase";

const ProfileContext = createContext<Profile>(undefined);

function useProfile() {
  const profile = useContext(ProfileContext);
  return profile;
}

const ProfileProvider: FC<PropsWithChildren<{}>> = props => {
  const { children } = props;
  const user = useUser();
  const database = useDatabase();
  
  const [profile, setProfile] = useState(undefined);
  useEffect(() => {
    database?.collection("Staff")
      .findOne({ username: user?.profile.name })
      .then(result => setProfile(result))
      .catch(() => {
        message.error("Akun Error. Aplikasi akan tutup dalam 3 detik.");
        setTimeout(logoutAndClose, 3000);
      });
  }, [user]);

  return (
    <ProfileContext.Provider value={profile}>
      {profile ? children : <Center><Spin size="large" /></Center>}
    </ProfileContext.Provider>
  );
}

export { ProfileProvider };
export default useProfile;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

type Profile = any; // Too lazy to write the proper type definition.
