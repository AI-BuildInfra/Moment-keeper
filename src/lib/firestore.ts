// ─── Firestore Typed CRUD Helpers ────────────────────────────

import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit, onSnapshot,
  serverTimestamp, Timestamp, writeBatch, QueryConstraint,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { MKEvent, Person, Group, UserProfile } from '@/types';

// ── Collection References ─────────────────────────────────────
export const COLLECTIONS = {
  users:      'users',
  events:     'events',
  persons:    'persons',
  groups:     'groups',
} as const;

// Helper function to strip undefined and forbidden prototype keys before writing to Firestore
const FORBIDDEN_PROTOTYPE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export const cleanPayload = <T extends Record<string, any>>(obj: T): Partial<T> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_PROTOTYPE_KEYS.has(key)) continue;
    const val = (obj as any)[key];
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }
  return cleaned as Partial<T>;
};

// ── User Profile ──────────────────────────────────────────────
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  const profile = snap.data() as UserProfile;
  try {
    const secretSnap = await getDoc(doc(db, COLLECTIONS.users, uid, 'private', 'secrets'));
    if (secretSnap.exists()) {
      profile.privatePasskey = secretSnap.data().privatePasskey;
    }
    // No fallback to '1234' — undefined means the user has not set a passkey yet.
    // Callers must check for undefined and prompt the user to set one before encrypting.
  } catch (err) {
    console.warn('Failed to load user secrets:', err);
  }
  return profile;
};

export const createUserProfile = async (profile: UserProfile) => {
  const { privatePasskey, ...rest } = profile;
  await setDoc(doc(db, COLLECTIONS.users, profile.uid), {
    ...cleanPayload(rest),
    createdAt: serverTimestamp(),
  });
  if (privatePasskey) {
    await setDoc(doc(db, COLLECTIONS.users, profile.uid, 'private', 'secrets'), {
      privatePasskey
    });
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const { privatePasskey, ...rest } = data;
  const cleanedRest = cleanPayload(rest);
  if (Object.keys(cleanedRest).length > 0 || 'updatedAt' in data) {
    await updateDoc(doc(db, COLLECTIONS.users, uid), { ...cleanedRest, updatedAt: serverTimestamp() });
  }
  if (privatePasskey) {
    await setDoc(doc(db, COLLECTIONS.users, uid, 'private', 'secrets'), {
      privatePasskey
    }, { merge: true });
  }
};

// ── Events ────────────────────────────────────────────────────
export const getEvents = async (userId: string): Promise<MKEvent[]> => {
  const q = query(
    collection(db, COLLECTIONS.events),
    where('userId', '==', userId),
    where('isArchived', '==', false),
    orderBy('date', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent));
};

export const getArchivedEvents = async (userId: string): Promise<MKEvent[]> => {
  const q = query(
    collection(db, COLLECTIONS.events),
    where('userId', '==', userId),
    where('isArchived', '==', true),
    orderBy('updatedAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent));
};

export const subscribeToEvents = (
  userId: string,
  callback: (events: MKEvent[]) => void,
) => {
  const q = query(
    collection(db, COLLECTIONS.events),
    where('userId', '==', userId),
    where('isArchived', '==', false),
    orderBy('date', 'asc'),
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent)));
  });
};

export const createEvent = async (event: Omit<MKEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
  const finalPayload = {
    ...cleanPayload(event),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  // Removed: console.log — do not log event payloads (personal data leaks in DevTools / adb logcat)
  const ref = await addDoc(collection(db, COLLECTIONS.events), finalPayload);
  return ref.id;
};

export const updateEvent = async (id: string, data: Partial<MKEvent>) => {
  await updateDoc(doc(db, COLLECTIONS.events, id), {
    ...cleanPayload(data),
    updatedAt: serverTimestamp(),
  });
};

export const deleteEvent = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.events, id));
};

export const archiveEvent = async (id: string) => {
  await updateDoc(doc(db, COLLECTIONS.events, id), {
    isArchived: true,
    updatedAt: serverTimestamp(),
  });
};

export const restoreEvent = async (id: string) => {
  await updateDoc(doc(db, COLLECTIONS.events, id), {
    isArchived: false,
    updatedAt: serverTimestamp(),
  });
};

export const toggleFavorite = async (id: string, current: boolean) => {
  await updateDoc(doc(db, COLLECTIONS.events, id), {
    isFavorite: !current,
    updatedAt: serverTimestamp(),
  });
};

// ── Persons ───────────────────────────────────────────────────
export const getPersons = async (userId: string): Promise<Person[]> => {
  const q = query(
    collection(db, COLLECTIONS.persons),
    where('userId', '==', userId),
    orderBy('name', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Person));
};

export const createPerson = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
  const ref = await addDoc(collection(db, COLLECTIONS.persons), {
    ...cleanPayload(person),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updatePerson = async (id: string, data: Partial<Person>) => {
  await updateDoc(doc(db, COLLECTIONS.persons, id), {
    ...cleanPayload(data),
    updatedAt: serverTimestamp(),
  });
};

export const deletePerson = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.persons, id));
};

// ── Magic Byte Header Signatures ──────────────────────────────
// Validates actual file binary header regardless of file extension or renamed spoofing
type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif';

const detectRealImageType = async (blob: Blob): Promise<ImageFormat | null> => {
  const buffer = await blob.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'jpeg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
    bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A
  ) {
    return 'png';
  }
  // GIF: 47 49 46 38 (GIF87a or GIF89a)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return 'gif';
  }
  // WebP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp';
  }
  return null;
};

// CRITICAL FIX #3: Validate file magic byte signatures, type, and size before uploading.
// Disguised files (e.g. mal.js -> mal.png or payload.html -> payload.jpg) are strictly blocked!
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export const uploadPersonPhoto = async (userId: string, personId: string, blob: Blob): Promise<string> => {
  // 1. Validate claimed MIME type
  if (!ALLOWED_IMAGE_TYPES.has(blob.type)) {
    throw new Error(`Invalid file type "${blob.type}". Only JPEG, PNG, WebP, and GIF images are allowed.`);
  }

  // 2. Validate size
  if (blob.size > MAX_PHOTO_BYTES) {
    throw new Error(`File too large (${(blob.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
  }

  // 3. Binary Magic Byte Validation: verifies the ACTUAL file contents match a real image format
  const detectedType = await detectRealImageType(blob);
  if (!detectedType) {
    throw new Error('File validation failed: File content does not match genuine image binary signature. Disguised files (.js, .html, .exe) are blocked.');
  }

  const path = `users/${userId}/persons/${personId}/${Date.now()}_photo.${detectedType}`;
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, blob, { contentType: `image/${detectedType}` });
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
};

// ── Groups ────────────────────────────────────────────────────
export const getGroups = async (userId: string): Promise<Group[]> => {
  const q = query(
    collection(db, COLLECTIONS.groups),
    where('memberIds', 'array-contains', userId),
    orderBy('name', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Group));
};

export const createGroup = async (group: Omit<Group, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, COLLECTIONS.groups), {
    ...cleanPayload(group),
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserProfiles = async (uids: string[]): Promise<UserProfile[]> => {
  if (uids.length === 0) return [];
  const uniqueUids = Array.from(new Set(uids));
  const chunkSize = 30; // Firestore 'in' queries limit is 30
  const results: UserProfile[] = [];

  for (let i = 0; i < uniqueUids.length; i += chunkSize) {
    const chunk = uniqueUids.slice(i, i + chunkSize);
    const q = query(
      collection(db, COLLECTIONS.users),
      where('uid', 'in', chunk)
    );
    const snap = await getDocs(q);
    snap.docs.forEach(d => results.push(d.data() as UserProfile));
  }

  return results;
};

export const subscribeToGroups = (
  userId: string,
  email: string | null | undefined,
  callback: (groups: Group[]) => void
) => {
  const q1 = query(
    collection(db, COLLECTIONS.groups),
    where('memberIds', 'array-contains', userId)
  );

  if (!email) {
    return onSnapshot(q1, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Group));
      list.sort((a, b) => a.name.localeCompare(b.name));
      callback(list);
    });
  }

  const q2 = query(
    collection(db, COLLECTIONS.groups),
    where('memberIds', 'array-contains', email.toLowerCase().trim())
  );

  let list1: Group[] = [];
  let list2: Group[] = [];

  const updateCombined = () => {
    const combined = [...list1];
    list2.forEach(g => {
      if (!combined.some(cg => cg.id === g.id)) {
        combined.push(g);
      }
    });
    combined.sort((a, b) => a.name.localeCompare(b.name));
    callback(combined);
  };

  const unsub1 = onSnapshot(q1, snap => {
    list1 = snap.docs.map(d => ({ id: d.id, ...d.data() } as Group));
    updateCombined();
  });

  const unsub2 = onSnapshot(q2, snap => {
    list2 = snap.docs.map(d => ({ id: d.id, ...d.data() } as Group));
    updateCombined();
  });

  return () => {
    unsub1();
    unsub2();
  };
};

export const addMemberToGroupByEmail = async (groupId: string, email: string): Promise<string> => {
  const emailLower = email.toLowerCase().trim();
  
  // 1. Find user profile by email
  const q = query(collection(db, COLLECTIONS.users), where('email', '==', emailLower));
  const snap = await getDocs(q);
  
  let userId: string;
  let displayName: string;
  
  if (snap.empty) {
    // If the user has not registered yet, we add their email directly as a placeholder member ID.
    userId = emailLower;
    displayName = emailLower.split('@')[0];
  } else {
    const userDoc = snap.docs[0];
    userId = userDoc.id;
    displayName = userDoc.data().displayName || emailLower;
  }

  // 2. Add to group memberIds
  const groupRef = doc(db, COLLECTIONS.groups, groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) {
    throw new Error('Group not found.');
  }
  const groupData = groupSnap.data() as Group;
  if (groupData.memberIds.includes(userId) || groupData.memberIds.includes(emailLower)) {
    throw new Error('User is already invited or a member of this group.');
  }

  const updatedMembers = [...groupData.memberIds, userId];
  await updateDoc(groupRef, {
    memberIds: updatedMembers
  });

  return displayName;
};

export const leaveGroup = async (groupId: string, userId: string) => {
  const groupRef = doc(db, COLLECTIONS.groups, groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) return;
  const data = snap.data() as Group;
  const updatedMembers = data.memberIds.filter(id => id !== userId);
  
  if (updatedMembers.length === 0) {
    await deleteDoc(groupRef);
  } else {
    await updateDoc(groupRef, {
      memberIds: updatedMembers,
      ownerId: data.ownerId === userId ? updatedMembers[0] : data.ownerId
    });
  }
};

export const subscribeToVisibleEvents = (
  userId: string,
  groupIds: string[],
  callback: (events: MKEvent[]) => void
) => {
  // Query 1: Personal events
  const qPersonal = query(
    collection(db, COLLECTIONS.events),
    where('userId', '==', userId),
    where('isArchived', '==', false)
  );

  // If user is in no groups, just subscribe to personal events
  if (groupIds.length === 0) {
    return onSnapshot(qPersonal, snap => {
      const personal = snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent));
      personal.sort((a, b) => a.date.localeCompare(b.date));
      callback(personal);
    });
  }

  // Query 2: Group events (events that belong to the groups user is in)
  const qGroup = query(
    collection(db, COLLECTIONS.events),
    where('groupId', 'in', groupIds),
    where('isArchived', '==', false)
  );

  let personalEvents: MKEvent[] = [];
  let groupEvents: MKEvent[] = [];

  const updateCombined = () => {
    const combined = [...personalEvents];
    groupEvents.forEach(ge => {
      if (!combined.some(pe => pe.id === ge.id)) {
        combined.push(ge);
      }
    });
    // Sort by date asc
    combined.sort((a, b) => a.date.localeCompare(b.date));
    callback(combined);
  };

  const unsubPersonal = onSnapshot(qPersonal, snap => {
    personalEvents = snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent));
    updateCombined();
  });

  const unsubGroup = onSnapshot(qGroup, snap => {
    groupEvents = snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent));
    updateCombined();
  });

  return () => {
    unsubPersonal();
    unsubGroup();
  };
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfile | null) => void
) => {
  let profileData: UserProfile | null = null;
  let passkeyVal: string | undefined = undefined;

  const emit = () => {
    if (profileData) {
      callback({
        ...profileData,
        // privatePasskey is undefined if the user has never set one.
        // The UI must prompt users to create a passkey before using private events.
        privatePasskey: passkeyVal
      });
    } else {
      callback(null);
    }
  };

  const unsubProfile = onSnapshot(doc(db, COLLECTIONS.users, uid), (snap) => {
    profileData = snap.exists() ? (snap.data() as UserProfile) : null;
    emit();
  });

  const unsubSecrets = onSnapshot(doc(db, COLLECTIONS.users, uid, 'private', 'secrets'), (snap) => {
    if (snap.exists()) {
      passkeyVal = snap.data().privatePasskey;
    } else {
      passkeyVal = undefined; // No passkey set yet — do not fall back to '1234'
    }
    emit();
  }, (err) => {
    console.warn('Failed to subscribe to secrets:', err);
    passkeyVal = undefined;
    emit();
  });

  return () => {
    unsubProfile();
    unsubSecrets();
  };
};

export const subscribeToPersons = (
  userId: string,
  callback: (persons: Person[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.persons),
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Person)));
  });
};

export const subscribeToArchivedEvents = (
  userId: string,
  callback: (events: MKEvent[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.events),
    where('userId', '==', userId),
    where('isArchived', '==', true),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as MKEvent)));
  });
};
