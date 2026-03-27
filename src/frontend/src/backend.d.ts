import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MovieStoryboard {
    title: string;
    script: string;
    style: string;
    genre: string;
    prompt: string;
}
export interface AvatarConfig {
    jsonConfig: string;
    name: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Story {
    title: string;
    content: string;
    wordCount: bigint;
    createdAt: Time;
    genre: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAvatar(name: string): Promise<void>;
    deleteMovie(title: string): Promise<void>;
    deleteStory(title: string): Promise<void>;
    getAllUserItems(): Promise<[Array<Story>, Array<AvatarConfig>, Array<MovieStoryboard>]>;
    getAvatars(): Promise<Array<AvatarConfig>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMovies(): Promise<Array<MovieStoryboard>>;
    getStories(): Promise<Array<Story>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAvatar(avatar: AvatarConfig): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMovie(movie: MovieStoryboard): Promise<void>;
    saveStory(story: Story): Promise<void>;
}
