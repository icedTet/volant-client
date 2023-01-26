import { Utils, Vector, Face, Pose, Hand } from "kalidokit";
import * as THREE from "three";
import { VRM, VRMSchema } from "@pixiv/three-vrm";
import { FaceAI } from "./FaceAI";

const { clamp } = Utils;
const { lerp } = Vector;

type TFace = NonNullable<ReturnType<typeof Face["solve"]>>;

export class KalidokitController {
  private oldLookTarget = new THREE.Euler();

  public vrm?: VRM | null | undefined;
  constructor(vrm: VRM) {
    this.vrm = vrm;
    FaceAI.getInstance().on("results", this.animateVRM.bind(this));
    console.log("vrm added ", vrm);
  }
  dispose() {
    FaceAI.getInstance().off("results", this.animateVRM.bind(this));
    console.log("vrm removed ", this.vrm);
  }
  // public update = (delta: number) => {
  //   this.vrm?.update(delta);
  // };

  // public animate = () => {
  //   requestAnimationFrame(this.animate);
  //   this.update(this.clock.getDelta());
  //   this.renderer.render(this.scene, this.orbitCamera);
  // };

  // private load(onProgress: (event: ProgressEvent<EventTarget>) => void) {
  //   this.loader.crossOrigin = "anonymous";
  //   return new Promise<GLTF>((resolve, reject) =>
  //     this.loader.load(
  //       this.model,
  //       async (gltf) => {
  //         resolve(gltf);
  //       },

  //       onProgress,

  //       (error) => {
  //         reject(error);
  //       }
  //     )
  //   );
  // }

  public rigRotation = (
    name: string,
    x = 0,
    y = 0,
    z = 0,
    dampener = 1,
    lerpAmt = 0.3
  ) => {
    if (!this.vrm) return void null;
    const Part = this.vrm.humanoid?.getBoneNode(
      VRMSchema.HumanoidBoneName[
      name as keyof typeof VRMSchema.HumanoidBoneName
      ]
    );
    if (!Part) return void null;

    let euler = new THREE.Euler(x * dampener, y * dampener, z * dampener);
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmt);
  };

  public rigPosition = (
    name: string,
    x = 0,
    y = 0,
    z = 0,
    dampener = 1,
    lerpAmt = 0.3
  ) => {
    if (!this.vrm) return void null;
    const Part = this.vrm.humanoid?.getBoneNode(
      VRMSchema.HumanoidBoneName[
      name as keyof typeof VRMSchema.HumanoidBoneName
      ]
    );
    if (!Part) return;
    let vector = new THREE.Vector3(x * dampener, y * dampener, z * dampener);
    Part.position.lerp(vector, lerpAmt);
  };

  public rigFace = (riggedFace: TFace) => {
    if (!this.vrm) return void null;
    this.rigRotation(
      "Neck",
      riggedFace?.head.x,
      riggedFace?.head.y,
      riggedFace?.head.z,
      0.7
    );

    const Blendshape = this.vrm.blendShapeProxy!;
    const PresetName = VRMSchema.BlendShapePresetName;

    riggedFace.eye.l = lerp(
      clamp(1 - riggedFace.eye.l, 0, 1),
      Blendshape.getValue(PresetName.Blink) as number,
      0.5
    );
    riggedFace.eye.r = lerp(
      clamp(1 - riggedFace.eye.r, 0, 1),
      Blendshape.getValue(PresetName.Blink) as number,
      0.5
    );
    riggedFace.eye = Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I)!, .5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A)!, .5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E)!, .5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O)!, .5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U)!, .5));

    const lookTarget = new THREE.Euler(
      lerp(this.oldLookTarget.x, riggedFace.pupil.y, 0.4),
      lerp(this.oldLookTarget.y, riggedFace.pupil.x, 0.4),
      0,
      "XYZ"
    );
    this.oldLookTarget.copy(lookTarget);
    this.vrm.lookAt?.applyer?.lookAt(lookTarget);
  };

  public animateVRM = ({
    faceLandmarks,
    ea: pose3DLandmarks,
    poseLandmarks: pose2DLandmarks,
    rightHandLandmarks: leftHandLandmarks,
    leftHandLandmarks: rightHandLandmarks,
  }: any) => {
    if (faceLandmarks) {
      const riggedFace = Face.solve(faceLandmarks, {
        runtime: "mediapipe",
      })!;
      this.rigFace(riggedFace);
    }

    if (pose2DLandmarks && pose3DLandmarks) {
      const riggedPose = Pose.solve(pose3DLandmarks, pose2DLandmarks, {
        runtime: "mediapipe",
      })!;
      this.rigRotation(
        "Hips",
        riggedPose.Hips.rotation?.x,
        riggedPose.Hips.rotation?.y,
        riggedPose.Hips.rotation?.z,
        0.7
      );
      this.rigPosition(
        "Hips",
        -riggedPose.Hips.position.x,
        riggedPose.Hips.position.y + 1,
        -riggedPose.Hips.position.z,
        1,
        0.07
      );

      this.rigRotation(
        "Chest",
        riggedPose.Spine.x,
        riggedPose.Spine.y,
        riggedPose.Spine.z,
        0.25,
        0.3
      );
      this.rigRotation(
        "Spine",
        riggedPose.Spine.x,
        riggedPose.Spine.y,
        riggedPose.Spine.z,
        0.45,
        0.3
      );

      for (const l of [
        "RightUpperArm",
        "RightLowerArm",
        "LeftUpperArm",
        "LeftLowerArm",
        "RightUpperLeg",
        "RightLowerLeg",
        "LeftUpperLeg",
        "LeftLowerLeg",
      ] as const) {
        const { x, y, z } = riggedPose[l];
        this.rigRotation(l, x, y, z,);
      }

      if (leftHandLandmarks) {
        const riggedHand = Hand.solve(leftHandLandmarks, "Left")!;
        this.rigRotation(
          "LeftHand",
          riggedHand.LeftWrist.x,
          riggedHand.LeftWrist.y,
          riggedPose.LeftHand.z
        );

        for (const l of [
          "LeftThumbProximal",
          "LeftThumbIntermediate",
          "LeftThumbDistal",
          "LeftIndexProximal",
          "LeftIndexIntermediate",
          "LeftIndexDistal",
          "LeftMiddleProximal",
          "LeftMiddleIntermediate",
          "LeftMiddleDistal",
          "LeftRingProximal",
          "LeftRingIntermediate",
          "LeftRingDistal",
          "LeftLittleProximal",
          "LeftLittleIntermediate",
          "LeftLittleDistal",
        ] as const) {
          const { x, y, z } = riggedHand[l];
          this.rigRotation(l, x, y, z);
        }
      }

      if (rightHandLandmarks) {
        console.log(rightHandLandmarks);
        const riggedHand = Hand.solve(rightHandLandmarks, "Right")!;
        console.log(riggedHand);
        this.rigRotation(
          "RightHand",
          riggedHand.RightWrist.x,
          riggedHand.RightWrist.y,
          riggedPose.RightHand.z
        );

        for (const l of [
          "RightThumbProximal",
          "RightThumbIntermediate",
          "RightThumbDistal",
          "RightIndexProximal",
          "RightIndexIntermediate",
          "RightIndexDistal",
          "RightMiddleProximal",
          "RightMiddleIntermediate",
          "RightMiddleDistal",
          "RightRingProximal",
          "RightRingIntermediate",
          "RightRingDistal",
          "RightLittleProximal",
          "RightLittleIntermediate",
          "RightLittleDistal",
        ] as const) {
          const { x, y, z } = riggedHand[l];
          this.rigRotation(l, x, y, z);
        }
      }
    }
  };
}
