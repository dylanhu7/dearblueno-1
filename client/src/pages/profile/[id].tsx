import styles from "styles/ProfilePage.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { loadAuth } from "gateways/AuthGateway";
import { useQuery } from "react-query";
import MainLayout from "components/layout/MainLayout";
import Head from "next/head";
import NotFoundPage from "pages/404";
import { GetStaticProps, NextPage } from "next";

type ProfilePageProps = {
  user?: IUser;
};

const ProfilePage: NextPage<ProfilePageProps> = (props) => {
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

  const profileUser = props.user;

  if (!profileUser) {
    return <NotFoundPage />;
  }

  if (isLoadingUser) {
    return <MainLayout page={<div>Loading...</div>} />;
  }

  const title =
    user?._id === profileUser._id
      ? "My Profile"
      : profileUser?.name + "'s Profile";

  return (
    <>
      <Head>
        <title>
          {(profileUser?.name ?? "User Not Found") + " - Dear Blueno"}
        </title>
      </Head>
      <MainLayout
        title={title}
        page={<ProfilePageMain user={user} profileUser={profileUser} />}
      />
    </>
  );
};

type ProfilePageMainProps = {
  user?: IUser;
  profileUser: IBasicUser;
};

function ProfilePageMain(props: ProfilePageMainProps) {
  return (
    <div className={styles.ProfilePage}>
      <ProfileBox user={props.user} profileUser={props.profileUser} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userID = context.params?.id as string;
  const user = await getUser(userID);
  if (user.success) {
    return {
      props: {
        user: user.payload,
      },
      revalidate: 30,
    };
  }
  return {
    props: {
      user: null,
    },
    revalidate: 30,
  };
};

export const getStaticPaths = async () => {
  // Server-render and cache pages on the fly.
  return { fallback: "blocking", paths: [] };
};

export default ProfilePage;
