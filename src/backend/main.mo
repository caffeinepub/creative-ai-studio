import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ******************
  // User Profile Type
  // ******************
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // ******************
  // User Profile Functions
  // ******************
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ******************
  // Types & Modules
  // ******************
  // 1. Saved Stories
  type Story = {
    title : Text;
    genre : Text;
    content : Text;
    wordCount : Nat;
    createdAt : Time.Time;
  };

  module Story {
    public func compare(story1 : Story, story2 : Story) : Order.Order {
      Text.compare(story1.title, story2.title);
    };
  };

  // 2. Saved Avatars
  type AvatarConfig = {
    name : Text;
    jsonConfig : Text;
  };

  module AvatarConfig {
    public func compare(config1 : AvatarConfig, config2 : AvatarConfig) : Order.Order {
      Text.compare(config1.name, config2.name);
    };
  };

  // 3. Saved Movies
  type MovieStoryboard = {
    title : Text;
    genre : Text;
    style : Text;
    prompt : Text;
    script : Text;
  };

  module MovieStoryboard {
    public func compare(storyboard1 : MovieStoryboard, storyboard2 : MovieStoryboard) : Order.Order {
      Text.compare(storyboard1.title, storyboard2.title);
    };
  };

  // ******************
  // Data Storage
  // ******************
  // For Stories: Map of user -> Map of title -> Story
  let storyBook = Map.empty<Principal, Map.Map<Text, Story>>();

  // For Avatars: Map of user -> Map of name -> AvatarConfig
  let avatarBook = Map.empty<Principal, Map.Map<Text, AvatarConfig>>();

  // For Movies: Map of user -> Map of title -> MovieStoryboard
  let movieBook = Map.empty<Principal, Map.Map<Text, MovieStoryboard>>();

  // ******************
  // Helper Functions
  // ******************
  func getUserBook<T>(book : Map.Map<Principal, Map.Map<Text, T>>, user : Principal) : Map.Map<Text, T> {
    switch (book.get(user)) {
      case (null) {
        Runtime.trap("User not found in store");
      };
      case (?userBook) {
        userBook;
      };
    };
  };

  // ******************
  // CRUD Functions
  // ******************
  // 1. Stories
  public shared ({ caller }) func saveStory(story : Story) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save stories");
    };

    let userStories = switch (storyBook.get(caller)) {
      case (null) {
        let newStories = Map.empty<Text, Story>();
        storyBook.add(caller, newStories);
        newStories;
      };
      case (?existing) {
        existing;
      };
    };
    userStories.add(story.title, story);
  };

  public query ({ caller }) func getStories() : async [Story] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve stories");
    };
    getUserBook(storyBook, caller).values().toArray().sort();
  };

  public shared ({ caller }) func deleteStory(title : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete stories");
    };
    let userStories = getUserBook(storyBook, caller);
    if (not userStories.containsKey(title)) {
      Runtime.trap("Story not found");
    };
    userStories.remove(title);
  };

  // 2. Avatars
  public shared ({ caller }) func saveAvatar(avatar : AvatarConfig) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save avatars");
    };

    let userAvatars = switch (avatarBook.get(caller)) {
      case (null) {
        let newAvatars = Map.empty<Text, AvatarConfig>();
        avatarBook.add(caller, newAvatars);
        newAvatars;
      };
      case (?existing) {
        existing;
      };
    };
    userAvatars.add(avatar.name, avatar);
  };

  public query ({ caller }) func getAvatars() : async [AvatarConfig] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve avatars");
    };
    getUserBook(avatarBook, caller).values().toArray().sort();
  };

  public shared ({ caller }) func deleteAvatar(name : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete avatars");
    };
    let userAvatars = getUserBook(avatarBook, caller);
    if (not userAvatars.containsKey(name)) {
      Runtime.trap("Avatar not found");
    };
    userAvatars.remove(name);
  };

  // 3. Movies
  public shared ({ caller }) func saveMovie(movie : MovieStoryboard) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save movies");
    };

    let userMovies = switch (movieBook.get(caller)) {
      case (null) {
        let newMovies = Map.empty<Text, MovieStoryboard>();
        movieBook.add(caller, newMovies);
        newMovies;
      };
      case (?existing) {
        existing;
      };
    };
    userMovies.add(movie.title, movie);
  };

  public query ({ caller }) func getMovies() : async [MovieStoryboard] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve movies");
    };
    getUserBook(movieBook, caller).values().toArray().sort();
  };

  public shared ({ caller }) func deleteMovie(title : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete movies");
    };
    let userMovies = getUserBook(movieBook, caller);
    if (not userMovies.containsKey(title)) {
      Runtime.trap("Movie not found");
    };
    userMovies.remove(title);
  };

  // Method to get all user items.
  public query ({ caller }) func getAllUserItems() : async ([Story], [AvatarConfig], [MovieStoryboard]) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve all user items");
    };
    (
      getUserBook(storyBook, caller).values().toArray().sort(),
      getUserBook(avatarBook, caller).values().toArray().sort(),
      getUserBook(movieBook, caller).values().toArray().sort(),
    );
  };
};
