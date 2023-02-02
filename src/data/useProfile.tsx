import { FC, PropsWithChildren, useState, useEffect, useContext, createContext } from "react";
import styled from "styled-components";
import { Spin, message } from "antd";
import useDatabase, { useUser, logoutAndClose } from "./useDatabase";

const ProfileContext = createContext<Profile>(undefined);

// Intended for use to be wrapped around the entire app to give global access to the user's profile data.

const ProfileProvider: FC<PropsWithChildren<{}>> = props => {
  const { children } = props;
  const user = useUser();
  const database = useDatabase();
  const [profile, setProfile] = useState(undefined);

  // Fetches the current user's corresponding profile data from the 'Staff' collection.
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

// Returns the cached profile data of the logged-in user.
function useProfile() {
  const profile = useContext(ProfileContext);
  return profile;
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
