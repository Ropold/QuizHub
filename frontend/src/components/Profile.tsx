import type {UserDetails} from "./model/UserDetailsModel.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
}

export default function Profile(props: Readonly<ProfileProps>) {
    return (
        <div>
            <h3>Profile</h3>
            <p>{props.user}</p>
        </div>
    )
}